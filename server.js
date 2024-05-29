require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Document = require('./models/document');
const multer = require('multer');
const User = require('./models/user');
const bodyParser = require('body-parser');
const session = require('./config/session');
const authenticate = require('./middleware');
const request = require('request');
const flash = require('connect-flash');
const argon2 = require('argon2');
const expressMongoSanitize = require('express-mongo-sanitize');


const app = express();

connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session);
app.use(flash());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(expressMongoSanitize());


const storage = multer.diskStorage({
  destination: 'uploads/', 
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/png' || 
      file.mimetype === 'image/jpeg' || 
      file.mimetype === 'application/gif'  || 
      file.mimetype === 'application/webp' ||
      file.mimetype === 'application/jpg' ||
      file.mimetype === 'application/bmp') {
    cb(null, true);
  } else {
    return cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

/////////////////////////////////////////////////////////////////////
app.get('/register', (req, res) => {
  res.render('register'); 
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).render('register', { error: 'Please fill in all fields' });
  }
  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).render('register', { error: 'Username already exists' });
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = new User({
          username,
          password: hashedPassword,
      });

      await newUser.save();
      res.redirect('/login');
  } catch (error) {
      console.error(error);
      res.status(500).render('register', { error: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ username });
      if (!user) {
          req.flash('error', 'User not found');
          return res.render('login', { error: req.flash('error') });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
          req.flash('error', 'Invalid password');
          return res.render('login', { error: req.flash('error') });
      }

      req.session.userId = user._id;
      res.redirect('/upload');
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

app.get('/upload', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('upload', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// app.get('/home', async (req, res) => {
//     const documents = await Document.find();
//     res.render('index', { documents})
// });

app.post('/upload', authenticate, upload.single('document'), async (req, res) => {
  try {
    const documentType = req.body.document_type;
    const newDocument = new Document({
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      path: req.file.path,
      documentType: documentType,
      user: req.session.userId
    });
    await newDocument.save();

    const imagePath = req.file.path;

    request.post({
      url: 'http://127.0.0.1:5000/check-document',
      form: {
        image_path: imagePath,
        document_type: documentType
      }
    }, async (error, response, body) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error occurred while processing document');
      }

      const result = JSON.parse(body).result;
      console.log(result);

      // Update the status of the document based on the result
      await Document.findByIdAndUpdate(newDocument._id, { status: result });

      res.render('result', { result });
    });
  } catch (error) {
    res.render('error', { error });
  }
});


// Add a new route for the user profile page
app.get('/profile', authenticate, async (req, res) => {
  try {
    // Fetch the user's information from the database
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Fetch documents uploaded by the user
    const documents = await Document.find({ user: req.session.userId }).populate('user');;

    // Render the profile page with user information and documents
    res.render('profile', { user, documents });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Add a route for logout
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    // Redirect the user to the login page after logout
    res.redirect('/upload');
  });
});



app.listen(5000, () => console.log('Server running on port 5000'));