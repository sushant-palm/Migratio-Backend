const hubspotAuth = require('../hubspot/auth');
const hubspotService = require('../services/hubspotService');

exports.install = (req, res) => {
  res.redirect(hubspotAuth.getAuthUrl());
};

exports.oauthCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`/error?msg=Missing authorization code`);
  try {
    await hubspotAuth.handleOAuthCallback(code, req.sessionID);
    res.redirect('/hubspot');
  } catch (err) {
    res.redirect(`/error?msg=Token exchange failed`);
  }
};

exports.root = async (req, res) => {
  if (hubspotAuth.isAuthorized(req.sessionID)) {
    const accessToken = await hubspotAuth.getAccessToken(req.sessionID);
    try {
      const portalInfo = await hubspotService.getPortalInfo(accessToken);
      res.send(`<h2>HubSpot Portal Info</h2><p><strong>Portal ID:</strong> ${portalInfo.portalId}</p>`);
    } catch (err) {
      res.send('Failed to fetch portal info');
    }
  } else {
    res.send(`<a href="/hubspot/install">Install HubSpot App</a>`);
  }
};

exports.getContacts = async (req, res) => {
  if (!hubspotAuth.isAuthorized(req.sessionID)) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  const accessToken = await hubspotAuth.getAccessToken(req.sessionID);
  try {
    const contacts = await hubspotService.getContacts(accessToken, req.query);
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts', details: err.message });
  }
};

exports.getDeals = async (req, res) => {
  if (!hubspotAuth.isAuthorized(req.sessionID)) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  const accessToken = await hubspotAuth.getAccessToken(req.sessionID);
  try {
    const deals = await hubspotService.getDeals(accessToken, req.query);
    res.json({ deals });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deals', details: err.message });
  }
};

exports.getTickets = async (req, res) => {
  if (!hubspotAuth.isAuthorized(req.sessionID)) {
    return res.status(401).json({ error: 'Not authorized' });
  }
  const accessToken = await hubspotAuth.getAccessToken(req.sessionID);
  try {
    const tickets = await hubspotService.getTickets(accessToken, req.query);
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets', details: err.message });
  }
};
