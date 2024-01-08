const { google } = require('googleapis');
const { Event } = require('../models/Data'); // Updated model import

const sheets = google.sheets('v4');
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Updated spreadsheet ID and range to include event-specific data
const spreadsheetId = '1vXIX0_Hx27HQRoMtSdJ22DtCfohYgafZENaddj6RKSI';
const range = 'WTB2.0!A2:G';

const columnMapping = {
  'EVENT NAME': 'eventName', // Map to the eventName field in the contactSchema
  'EMAIL': 'email',
  'PHONE': 'phone',
  'UTM_SOURCE': 'source',
  'LEAD OR REGISTRANT': 'leadOrRegistrant',
  'COACH': 'assignedTo',
  'COACH EMAIL': 'coachEmail', // Assuming you want to add this field
};

async function fetchAndSaveContactData(eventId) {
  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      console.log('Event not found.');
      return;
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      key: API_KEY,
    });

    const rows = response.data.values;
    if (rows.length > 1) {
      for (const row of rows.slice(1)) {
        let newContactData = {};

        row.forEach((cell, index) => {
          const columnName = rows[0][index];
          const schemaFieldName = columnMapping[columnName];
          if (schemaFieldName) {
            newContactData[schemaFieldName] = cell;
          }
        });

        // Check if contact already exists
        const existingContact = event.contacts.find(
          (contact) => contact.email === newContactData.email
        );

        if (!existingContact) {
          // Create a new contact associated with the event
          event.contacts.push(newContactData);
          await event.save();
          console.log(`Imported new contact: ${newContactData.email}`);
        } else {
          console.log(
            `Contact with email ${newContactData.email} already exists in the event. Skipping.`
          );
        }
      }

      console.log('Contacts imported successfully.');
    } else {
      console.log('No data found in the sheet.');
    }
  } catch (error) {
    console.error('Error importing contact data:', error);
  }
}

module.exports = { fetchAndSaveContactData };
