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

const commentsSchema = new mongoose.Schema({
  commenter: {
    type: String
  },
  text: {
    type: String
  },
  rating: {
    type: Number,
    default: null
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
  ratings: {
    type: [Number]
  },
  comments: {
    type: [commentsSchema]
  },
});

recipeSchema.methods.calculateAverageRating = function() {
  const commentsWithRatings = this.comments.filter(comment => comment.rating !== null && comment.rating !== undefined);
  const totalRating = commentsWithRatings.reduce((acc, cur) => acc + cur.rating, 0);
  const averageRating = totalRating / commentsWithRatings.length;
  this.ratings = isNaN(averageRating) ? null : averageRating;
};

recipeSchema.pre('save', async function(next) {
  if (this.isModified('comments') || this.isNew) {
    this.calculateAverageRating();
  }
  next();
});

const CocktailRecipe = mongoose.model('Cocktail', recipeSchema);

module.exports = CocktailRecipe;