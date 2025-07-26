const request = require('request-promise-native');

exports.getPortalInfo = async function(accessToken) {
  return await request.get('https://api.hubapi.com/integrations/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  });
};
