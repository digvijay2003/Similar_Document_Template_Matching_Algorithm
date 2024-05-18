const mongoose = require('mongoose');

const connectDB = async () => {
  try{
    await mongoose.connect('mongodb://127.0.0.1:27017/docs', {
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