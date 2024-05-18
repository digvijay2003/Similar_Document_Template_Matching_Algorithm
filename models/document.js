const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    fileName: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    data: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    documentType: { 
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String, // or Boolean, depending on your needs
      default: 'pending', // set default value to pending
    }
  });
  
const Document = mongoose.model('Document', documentSchema);
  
module.exports = Document;