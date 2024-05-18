const User = require('./models/user');

const authenticate = (req, res, next) => {
  // Check if userId is present in the session
  if (req.session.userId) {
      // If userId is present, proceed to the next middleware/route handler
      next();
  } else {
      // If userId is not present, redirect the user to the login page
      res.render('loginFirst', { message: 'Please login first' });
  }
};

module.exports = authenticate;