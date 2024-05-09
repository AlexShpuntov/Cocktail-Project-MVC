const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String
  },
  imageUrl: {
    type: String
  },
  measurements: {
    type: String
  }
});

const recipeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  imageUrl: {
    type: String,
    contentType: 'image/png'
  },
  ingredients: {
    type: [ingredientSchema]
  },
  instructions: {
    type: String
  },
  ratings: [{
    type: Number
  }],
  comments: [{
    type: String
  }]
});

const CocktailRecipe = mongoose.model('Cocktail', recipeSchema);

module.exports = CocktailRecipe;