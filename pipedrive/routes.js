const express = require('express');
const router = express.Router();
const { getAuthUrl, exchangeCodeForToken, refreshToken, isAuthorized, getAccessToken } = require('./auth');
const { getAccountDetails } = require('./api/account');
const { getContacts } = require('./api/contact');

// /pipedrive/install
router.get('/install', (req, res) => {
  const { url, state } = getAuthUrl();
  req.session.state = state; // Store state in session for CSRF protection
  res.redirect(url);
});

// /pipedrive/callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;
  if (state !== req.session.state) {
    return res.status(400).send('Error: Invalid state parameter (potential CSRF attack)');
  }
  try {
    const tokenData = await exchangeCodeForToken(code);
    req.session.pipedriveToken = tokenData.access_token;
    req.session.pipedriveRefreshToken = tokenData.refresh_token;
    // Store tokens in memory for session-based auth helpers
    const sessionID = req.sessionID;
    require('./auth').accessTokenStore[sessionID] = tokenData.access_token;
    require('./auth').refreshTokenStore[sessionID] = tokenData.refresh_token;
    res.redirect('/pipedrive/status');
  } catch (err) {
    console.error('Pipedrive OAuth callback error:', err);
    res.status(500).send('Error during Pipedrive OAuth callback: ' + (err && err.message ? err.message : JSON.stringify(err)));
  }
});

// App connection status
router.get('/status', async (req, res) => {
  const token = req.session.pipedriveToken;
  if (!token) {
  return res.json({ connected: false, message: 'App not connected. Contact the developer.' });
  }
  try {
  const details = await getAccountDetails(token);
  res.json({ connected: true, message: 'Your app is connected successfully!',details });
  } catch (err) {
  res.json({ connected: false, message: 'App not connected. Contact the developer.' });
  }
  });
  // Fetch account details (oragnization & owner)
  router.get('/companies-details', async (req, res) => {
  const token = req.session.pipedriveToken;
  if (!token) return res.redirect('/error?msg=' + encodeURIComponent('No Pipedrive token found'));
  try {
    const details = await getAccountDetails(token);
    res.json(details);
  } catch (err) {
    res.redirect('/error?msg=' + encodeURIComponent('Failed to fetch Pipedrive account details'));
  }
  });
  
  // Fetch contacts info
  router.get('/contacts', async (req, res) => {
  const token = req.session.pipedriveToken;
  if (!token) return res.redirect('/error?msg=' + encodeURIComponent('No Pipedrive token found'));
  try {
  const contacts = await getContacts(token);
  res.json({ contacts });
  } catch (err) {
  // If token expired, refresh it and retry
  if (err.response && err.response.status === 401) {
    const refreshedToken = await refreshToken(req.session.pipedriveRefreshToken);
    req.session.pipedriveToken = refreshedToken.access_token;
    req.session.pipedriveRefreshToken = refreshedToken.refresh_token;
    return res.redirect('/pipedrive/contacts'); // Retry fetching contacts with the new token
  }
  res.redirect('/error?msg=' + encodeURIComponent('Failed to fetch Pipedrive contacts'));
  }
  });

// /pipedrive
router.get('/', async (req, res) => {
  const sessionID = req.sessionID;
  if (isAuthorized(sessionID)) {
    const token = await getAccessToken(sessionID);
    try {
      const details = await getAccountDetails(token);
      res.send(`<h2>Pipedrive Account Info</h2><p><strong>Company ID:</strong> ${details.company_id}</p><p><strong>Owner Name:</strong> ${details.owner_id.name}</p>`);
    } catch (err) {
      res.send('Failed to fetch Pipedrive account info');
    }
  } else {
    res.send('<a href="/pipedrive/install">Install Pipedrive App</a>');
  }
});

module.exports = router;
