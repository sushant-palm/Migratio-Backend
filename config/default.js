module.exports = {
  hubspotApiKey: process.env.HUBSPOT_API_KEY || 'your-hubspot-api-key',
  pipedriveApiKey: process.env.PIPEDRIVE_API_KEY || 'your-pipedrive-api-key',
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'fallback-secret',
}; 