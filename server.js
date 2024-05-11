require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const cocktailRecipeRouter = require('./routes/cocktailRecipeRoutes');
const connectDB = require('./config/dbConnection');
const PORT = 3000;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', cocktailRecipeRouter);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});