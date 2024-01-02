const { google } = require('googleapis');
const Customer = require('../models/Contact'); 

const sheets = google.sheets('v4');
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY; 

const spreadsheetId = '1Guueh-T_u6FaaANjoAMbY_N9vfGxdYt9oNd_F6aqhpg';
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
        if (rows.length > 1) { 
            for (const row of rows.slice(1)) { 
                let newCustomerData = {};

                row.forEach((cell, index) => {
                    const columnName = rows[0][index]; 
                    const schemaFieldName = columnMapping[columnName];
                    if (schemaFieldName) {
                        if (schemaFieldName === 'vip') {
                            newCustomerData[schemaFieldName] = cell.toUpperCase() === 'TRUE';
                        } else if (schemaFieldName === 'revenue') {
                            newCustomerData[schemaFieldName] = parseFloat(cell) || 0;
                        } else if (schemaFieldName === 'date') {
                            newCustomerData[schemaFieldName] = new Date(cell);
                        } else {
                            newCustomerData[schemaFieldName] = cell;
                        }
                    }
                });

                // Check if customer already exists
                const existingCustomer = await Customer.findOne({ email: newCustomerData.email });
                if (!existingCustomer) {
                    const newCustomer = new Customer(newCustomerData);
                    await newCustomer.save();
                    console.log(`Imported new customer: ${newCustomerData.email}`);
                } else {
                    console.log(`Customer with email ${newCustomerData.email} already exists. Skipping.`);
                }
            }

            console.log('Customers imported successfully.');
        } else {
            console.log('No data found in the sheet.');
        }
    } catch (error) {
        console.error('The API returned an error: ', error);
    }
}

module.exports = { fetchAndSaveCustomerData };
