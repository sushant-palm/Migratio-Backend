require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(session({
  secret: Math.random().toString(36).substring(2),
  resave: false,
  saveUninitialized: true
}));

// Mount HubSpot routes under /hubspot
app.use('/hubspot', require('./hubspot/routes'));

// Root page
app.get('/', (req, res) => {
  res.send('<h2>Migratio Home</h2><a href="/hubspot">Go to HubSpot Integration</a>');
});

// Error page
app.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

app.listen(PORT, () => {
  console.log(`🚀 App running: http://localhost:${PORT}`);
  console.log(`🔗 HubSpot: http://localhost:${PORT}/hubspot`);
});
