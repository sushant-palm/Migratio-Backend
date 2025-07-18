const express = require('express');
const router = express.Router();
const hubspotAuth = require('./auth');
const { getPortalInfo } = require('./api/portal');

// /hubspot/install
router.get('/install', (req, res) => {
  res.redirect(hubspotAuth.getAuthUrl());
});

// /hubspot/oauth-callback
router.get('/oauth-callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`/error?msg=Missing authorization code`);
  try {
    await hubspotAuth.handleOAuthCallback(code, req.sessionID);
    res.redirect('/hubspot');
  } catch (err) {
    res.redirect(`/error?msg=Token exchange failed`);
  }
});

// /hubspot
router.get('/', async (req, res) => {
  if (hubspotAuth.isAuthorized(req.sessionID)) {
    const accessToken = await hubspotAuth.getAccessToken(req.sessionID);
    try {
      const portalInfo = await getPortalInfo(accessToken);
      res.send(`<h2>HubSpot Portal Info</h2><p><strong>Portal ID:</strong> ${portalInfo.portalId}</p>`);
    } catch (err) {
      res.send('Failed to fetch portal info');
    }
  } else {
    res.send(`<a href="/hubspot/install">Install HubSpot App</a>`);
  }
});

module.exports = router; 