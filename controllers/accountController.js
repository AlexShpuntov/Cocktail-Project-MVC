const UserAccount = require('../models/UserAccount');
const bcrypt = require('bcrypt');

exports.getSignUpUser = (req, res) => {
  try {
    res.render('signup', { message: 'Hello' });
  } catch (error) {
    console.error('Error loading Sign Up page:', error);
  }
};

exports.getLoginUser = (req, res) => {
  try {
    res.render('login', { message: 'Hello' });
  } catch (error) {
    console.error('Error loading Login page:', error);
  }
};

exports.postingSignup = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    const existingUser = await UserAccount.findOne({ email: data.email });
    if (existingUser) {
      res.status(200).json({ exists: true });
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword;
      const userData = await UserAccount.insertMany(data);
      console.log(userData);
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error posting Sign Up page:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.postingLogin = async (req, res) => {
  try {
    
  } catch (error) {

  }
};