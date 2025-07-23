const axios = require('axios');

async function getContacts(token) {
  try {
    const response = await axios.get('https://api.pipedrive.com/v1/persons', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data; // Array of contacts
  } catch (error) {
    console.error('Error fetching contacts from Pipedrive:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { getContacts };
