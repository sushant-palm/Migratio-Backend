module.exports = function requirePipedriveAuth(req, res, next) {
  if (!req.session.pipedriveToken) {
    return res.redirect('/error?msg=' + encodeURIComponent('No Pipedrive token found'));
  }
  next();
};
5