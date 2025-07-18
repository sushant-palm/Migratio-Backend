const request = require('request-promise-native');

async function getContacts(accessToken, options = {}) {
  const url = new URL('https://api.hubapi.com/crm/v3/objects/contacts');
  url.searchParams.append('limit', options.limit || '100');
  url.searchParams.append('archived', 'false');
  url.searchParams.append('properties', '*');
  if (options.after) url.searchParams.append('after', options.after);

  return await request.get(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true
  });
}

async function createContact(accessToken, data) {
  return await request.post('https://api.hubapi.com/crm/v3/objects/contacts', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: data,
    json: true
  });
}

module.exports = {
  getContacts,
  createContact
}; 