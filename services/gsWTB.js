const { google } = require('googleapis');
const { Event, Contact } = require('../models/Data'); // Updated model import


const sheets = google.sheets('v4');
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Updated spreadsheet ID and range to include event-specific data
const spreadsheetId = '1vXIX0_Hx27HQRoMtSdJ22DtCfohYgafZENaddj6RKSI';


const range = 'EVENTDATA!A1:N';

const columnMapping = {
  'EVENT NAME': 'eventName', // Map to the eventName field in the contactSchema
  'EVENT ID': 'eventId',
  'FIRST NAME': 'firstName',
  'LAST NAME': 'lastName',
  'EMAIL': 'email',
  'PHONE': 'phone',
  'TICKET REVENUE': 'ticketRevenue',
  'VIP': 'vip',
  'UTM_SOURCE': 'source',
  'COUNTRY': 'country',
  'STATE': 'state',
  'COACH': 'coachName',
  'COACH EMAIL': 'coachEmail', 
  'PIPELINE STATUS': 'pipelineStatus', 
};

async function fetchAndSaveContactData(eventId) {
  try {
    console.log(`Fetching and importing contacts for event with ID: ${eventId}`);

    // Find the event by ID
    const event = await Event.findById(eventId);

    if (!event) {
      console.log('Event not found.');
      return;
    }

    console.log(`Found event: ${event.name}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      key: API_KEY,
    });

    const rows = response.data.values;
    if (rows.length > 1) {
      console.log(`Found ${rows.length - 1} contacts in the sheet.`);

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

          // Create a standalone Contact document and save it to the "contacts" collection
          const newContact = new Contact(newContactData);
          await newContact.save();

          console.log(`Imported new contact: ${newContactData.email}`);
        } else {
          console.log(
            `Contact with email ${newContactData.email} already exists in the event. Skipping.`
          );
        }
      }

      // Save the modified event (with embedded contacts) to the events collection
      await event.save();

      console.log('Contacts imported successfully.');
    } else {
      console.log('No data found in the sheet.');
    }
  } catch (error) {
    console.error('Error importing contact data:', error);
  }
}

module.exports = { fetchAndSaveContactData };
