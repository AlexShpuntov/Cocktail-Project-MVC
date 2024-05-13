const CocktailRecipe = require('../models/CocktailRecipe');
const axios = require('axios');
const UserAccounts = require('../models/UserAccount');

let drinkId;

exports.getRandomDrinks = async (req, res) => {
  try {
    const promises = [];
    for (let i = 0; i < 6; i++) {
      promises.push(CocktailRecipe.aggregate([{ $sample: { size: 1 } }]));
    }
    const drinkResponse = await Promise.all(promises);
    const drinks = drinkResponse.map(drink => ({
      _id: drink[0]._id,
      name: drink[0].name,
      imageUrl: drink[0].imageUrl
    }));
    res.render('main', { title: 'Cocktails', drinks });
  } catch (error) {
    res.status(500).json({ message: 'Error getting random drinks' });
  }
};

exports.getCocktailRecipeById = async (req, res) => {
  try {
    drinkId = req.query.id;
    const drink = await CocktailRecipe.findById(drinkId);
    const ingredients = drink.ingredients;
    const instructions = drink.instructions;
    const commentReviews = drink.comments;
    res.render('cocktail-information', { title: 'Cocktail', drink, ingredients, instructions, editable: true, commentReviews });
  } catch (error) {
    res.status(500).json({ message: 'Error getting recipe for cocktail' });
  }
};

exports.postingComment = async (req, res) => {
  try {
    const text = req.body.comment;
    const commenter = res.locals.user.name;
    const recipe = await CocktailRecipe.findById(drinkId);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    recipe.comments.push({ commenter, text });
    await recipe.save();
    res.status(201).redirect(`${req.originalUrl}?id=${drinkId}`);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

exports.searchCocktailByName = async (req, res) => {
  try {
    const cocktailName = req.query.name;
    const regex = new RegExp(cocktailName, 'i');
    const drinksData = await CocktailRecipe.find({ name: { $regex: regex } });
    const drinks = drinksData.map(drink => ({
      _id: drink._id,
      name: drink.name,
      imageUrl: drink.imageUrl
    }));  
    res.render('search-result', { title: 'Cocktail', drinks });
  } catch (error) {
    res.status(500).json({ message: 'Error getting recipe for cocktail' });
  }
};