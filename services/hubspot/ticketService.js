const request = require('request-promise-native');

exports.getTickets = async function(accessToken, options = {}) {
  const url = new URL('https://api.hubapi.com/crm/v3/objects/tickets');
  url.searchParams.append('limit', options.limit || '100');
  url.searchParams.append('archived', 'false');
  url.searchParams.append('properties', '*');
  if (options.after) url.searchParams.append('after', options.after);
  return await request.get(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  });
}; 