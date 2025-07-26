module.exports = {
  hubspotApiKey: process.env.HUBSPOT_API_KEY || 'dev-hubspot-api-key',
  pipedriveApiKey: process.env.PIPEDRIVE_API_KEY || 'dev-pipedrive-api-key',
  port: process.env.PORT || 3000,
  debug: true,
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
}; 