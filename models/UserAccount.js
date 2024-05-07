const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  confirmPassword: {
    type: String
  }
});

const UserAccounts = mongoose.model('User', LoginSchema);

module.exports = UserAccounts;