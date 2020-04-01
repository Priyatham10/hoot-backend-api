const atob = require('atob');

// DISCLAIMER: This authorization flow is simplified is purely for demonstrative purposes!
// We do not recommend performing actual authentication like this!

// For simplicity's sake, we log users into Hoot with just a username and no password.
// When users log in, we simply store their username in a cookie — see $('#login').submit() in public/script.js
// When users log out, we simply clear the cookie — see the /logout route in index.js

module.exports = (req, res, next) => {
  // Authorization headers are used to authenticate requests from the HTTP API
  // We also pass users' Basic Auth credentials into the API docs via Custom Login! See middleware/jwt.js
  if (req.headers.authorization) {
    try {
      const b64 = req.headers.authorization.split(' ')[1];
      const [user] = atob(b64).split(':');
      req.user = user;
    } catch (e) {} // eslint-disable-line no-empty
  } else {
    // When the users visit the site, we look for the 'username' cookie.
    // If we find the cookie, we log them in!
    req.user = req.cookies.username;
    if (req.user) {
      // If we log them in, we're also tacking the authorization header to the request so we're consistent.
      // This also makes it easy to replicate the request if we're viewing its log in API Metrics!
      const authorization = Buffer.from(`${req.user}:`).toString('base64');
      req.headers.authorization = `Basic ${authorization}`;
    }
  }
  res.locals.user = req.user;
  next();
};
