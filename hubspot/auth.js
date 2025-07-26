const request = require('request-promise-native');
const NodeCache = require('node-cache');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SCOPES = process.env.SCOPE || 'crm.objects.contacts.read crm.objects.contacts.write crm.schemas.contacts.read oauth tickets crm.schemas.deals.write crm.schemas.deals.read crm.objects.deals.read crm.objects.deals.write';
const REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI || `http://localhost:3000/hubspot/oauth-callback`;

const accessTokenCache = new NodeCache({ deleteOnExpire: true });
const refreshTokenStore = {};

function getAuthUrl() {
  return `https://app.hubspot.com/oauth/authorize` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
}

async function handleOAuthCallback(code, sessionID) {
  const tokenPayload = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code
  };
  const response = await request.post('https://api.hubapi.com/oauth/v1/token', { form: tokenPayload });
  const tokens = JSON.parse(response);
  refreshTokenStore[sessionID] = tokens.refresh_token;
  accessTokenCache.set(sessionID, tokens.access_token, Math.round(tokens.expires_in * 0.75));
  return tokens;
}

async function getAccessToken(sessionID) {
  if (!accessTokenCache.get(sessionID)) {
    const tokenPayload = {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: refreshTokenStore[sessionID]
    };
    const response = await request.post('https://api.hubapi.com/oauth/v1/token', { form: tokenPayload });
    const tokens = JSON.parse(response);
    accessTokenCache.set(sessionID, tokens.access_token, Math.round(tokens.expires_in * 0.75));
  }
  return accessTokenCache.get(sessionID);
}

function isAuthorized(sessionID) {
  return !!refreshTokenStore[sessionID];
}

module.exports = {
  getAuthUrl,
  handleOAuthCallback,
  getAccessToken,
  isAuthorized
}; 
