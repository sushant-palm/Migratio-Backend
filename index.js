require('dotenv').config();
const express = require('express');
const session = require('express-session');
const config = require('./config'); //  Use your config system
const app = express();
const PORT = config.port;

app.use(session({
secret: config.sessionSecret,
resave: false,
saveUninitialized: true,
cookie: { maxAge: 3600000 } // 1 hour
}));

app.use('/hubspot', require('./routes/hubspot'));

app.use('/pipedrive', require('./routes/pipedrive'));

// Root page
app.get('/', (req, res) => {
res.send('<h2>Migratio Home</h2>' +
  '<a href="/hubspot">Go to HubSpot Integration</a><br/>' +
  '<a href="/pipedrive">Go to Pipedrive Integration</a>');
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
