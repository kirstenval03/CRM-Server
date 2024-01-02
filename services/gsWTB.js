const { google } = require('googleapis');
const { Contact } = require('../models/Data'); // Updated model import

const sheets = google.sheets('v4');
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

const spreadsheetId = '1vXIX0_Hx27HQRoMtSdJ22DtCfohYgafZENaddj6RKSI';
const range = 'WTB2.0!A2:G';

const columnMapping = {
    'EMAIL': 'email',
    'PHONE': 'phone',
    'UTM_SOURCE': 'source',
    'LEAD OR REGISTRANT': 'leadOrRegistrant',
    'COACH': 'assignedTo',
};

async function fetchAndSaveContactData() {
    try {
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
                const existingContact = await Contact.findOne({ email: newContactData.email });
                if (!existingContact) {
                    const newContact = new Contact(newContactData);
                    await newContact.save();
                    console.log(`Imported new contact: ${newContactData.email}`);
                } else {
                    console.log(`Contact with email ${newContactData.email} already exists. Skipping.`);
                }
            }

            console.log('Contacts imported successfully.');
        } else {
            console.log('No data found in the sheet.');
        }
    } catch (error) {
        console.error('The API returned an error: ', error);
    }
}

module.exports = { fetchAndSaveContactData };
