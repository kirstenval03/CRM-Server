var express = require('express');
var router = express.Router();

const Lead = require('../models/Lead');
const isAuthenticated = require('../middleware/isAuthenticated');
const { fetchAndSaveLeadData } = require('../services/gsCoachesRoster');

// GET LEADS FROM GOOGLE-SHEETS
router.get('/import-from-google-sheets', async (req, res) => {
    try {
        await fetchAndSaveLeadData();
        res.send('Lead data import completed successfully.');
    } catch (error) {
        console.error('Error importing lead data:', error);
        res.status(500).send('Error importing lead data.');
    }
});

// DISPLAY ALL LEADS
router.get('/', (req, res, next) => {
    Lead.find()
        .then((allLeads) => {
            res.json(allLeads);
        })
        .catch((err) => {
            console.error("Error fetching leads:", err); 
            res.status(500).json({ error: err.message });
        });
});

// SEE LEAD DETAILS
router.get('/:leadId', isAuthenticated, (req, res, next) => {
    const { leadId } = req.params;

    Lead.findById(leadId)
        .then((foundLead) => {
            if (!foundLead) {
                return res.status(404).send('Lead not found.');
            }
            res.json(foundLead);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

// UPDATE LEAD STATUS COLOR
router.patch('/:leadId/update-color', async (req, res) => {
    const { leadId } = req.params;
    const { statusColor } = req.body; // Change this line

    console.log(`Updating color for lead ${leadId} to ${statusColor}`); // Update this line

    try {
        const updatedLead = await Lead.findByIdAndUpdate(leadId, { statusColor }, { new: true });
        if (!updatedLead) {
            return res.status(404).send('Lead not found.');
        }
        res.json(updatedLead);
    } catch (error) {
        console.error('Error updating lead color:', error);
        res.status(400).send('Invalid request data.');
    }
});

module.exports = router;
