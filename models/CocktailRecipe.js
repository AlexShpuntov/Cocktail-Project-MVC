const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  ingredients: {
    type: [String]
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