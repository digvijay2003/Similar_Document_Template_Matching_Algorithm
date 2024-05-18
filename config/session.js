const session = require('express-session');
const crypto = require('crypto');
const secrett = crypto.randomBytes(64).toString('hex');


const sessionConfig = {
  secret: secrett, // Replace with a long, random string
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS in production
    maxAge: 60 * 60 * 1000, // Session expires after 1 hour
  },
};

module.exports = session(sessionConfig);