module.exports = function requireHubspotAuth(req, res, next) {
  if (!req.session.hubspotToken) {
    return res.redirect('/error?msg=' + encodeURIComponent('No HubSpot token found'));
  }
  next();
};
