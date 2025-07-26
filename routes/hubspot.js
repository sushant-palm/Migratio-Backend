const express = require('express');
const router = express.Router();
const hubspotController = require('../controllers/hubspotController');

router.get('/install', hubspotController.install);
router.get('/oauth-callback', hubspotController.oauthCallback);
router.get('/', hubspotController.root);
router.get('/contacts', hubspotController.getContacts);
router.get('/deals', hubspotController.getDeals);
router.get('/tickets', hubspotController.getTickets);

module.exports = router;
