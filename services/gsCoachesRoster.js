const { google } = require('googleapis');
const Lead = require('../models/Lead'); 

const sheets = google.sheets('v4');
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY; 

const spreadsheetId = '1y1MX_7O2WQ9gZHGx7m8tuw85gyzE4yuKn0Bko0RMVs8';
const range = 'MasterList!A1:D';

const columnMapping = {
    'Client Name': 'name',
    'Client Email': 'email',
    'Coach Name': 'coachName',
    'Coach Email': 'coachEmail',
};

async function fetchAndSaveLeadData() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
            key: API_KEY,
        });

        const rows = response.data.values;
        if (rows.length > 1) {
            for (const row of rows.slice(1)) { // Skip header row
                let newLeadData = {};

                row.forEach((cell, index) => {
                    const columnName = rows[0][index]; // Column name from header row
                    const schemaFieldName = columnMapping[columnName];
                    if (schemaFieldName) {
                        newLeadData[schemaFieldName] = cell;
                    }
                });

                // Check if lead already exists to avoid duplicates
                const existingLead = await Lead.findOne({ email: newLeadData.email });
                if (!existingLead) {
                    const newLead = new Lead(newLeadData);
                    await newLead.save();
                }
            }

            console.log('Leads imported successfully.');
        } else {
            console.log('No data found in the sheet.');
        }
    } catch (error) {
        console.error('The API returned an error: ', error);
    }
}

module.exports = { fetchAndSaveLeadData };