const { google } = require('googleapis');
const Customer = require('../models/Customer'); 

const sheets = google.sheets('v4');

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY; 

const spreadsheetId = '1Guueh-T_u6FaaANjoAMbY_N9vfGxdYt9oNd_F6aqhpg'; // Replace with your Spreadsheet ID
const range = 'Registrations!B2:K'; 

const columnMapping = {
    'FIRST NAME': 'firstName',
    'LAST NAME': 'lastName',
    'EMAIL': 'email',
    'PHONE': 'phone',
    'TICKET REVENUE': 'revenue',
    'DATE': 'date',
    'VIP': 'vip',
    'UTM SOURCE': 'utmSource', 
};

async function fetchAndSaveCustomerData() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
            key: API_KEY,
        });

        const rows = response.data.values;
        if (rows.length > 1) { // Checking if there's more than just the header row
            // Process each row and save to MongoDB
            rows.slice(1).forEach(async (row) => { // Skip header row
                let newCustomerData = {};

                row.forEach((cell, index) => {
                    const columnName = response.data.values[0][index]; // Column name from header row
                    const schemaFieldName = columnMapping[columnName];
                    if (schemaFieldName) {
                        if (schemaFieldName === 'vip') {
                            newCustomerData[schemaFieldName] = cell.toUpperCase() === 'TRUE'; // Convert string to Boolean
                        } else if (schemaFieldName === 'revenue') {
                            newCustomerData[schemaFieldName] = parseFloat(cell) || 0; // Convert string to number
                        } else if (schemaFieldName === 'date') {
                            newCustomerData[schemaFieldName] = new Date(cell); // Convert string to Date
                        } else {
                            newCustomerData[schemaFieldName] = cell;
                        }
                    }
                });

                const newCustomer = new Customer(newCustomerData);
                await newCustomer.save();
            });

            console.log('Customers imported successfully.');
        } else {
            console.log('No data found in the sheet.');
        }
    } catch (error) {
        console.error('The API returned an error: ', error);
    }
}

module.exports = { fetchAndSaveCustomerData };
