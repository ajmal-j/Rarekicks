const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connect;
