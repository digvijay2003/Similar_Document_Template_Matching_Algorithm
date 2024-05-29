const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;

const connectDB = async () => {
  try{
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;