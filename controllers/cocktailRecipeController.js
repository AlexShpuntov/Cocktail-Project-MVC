const CocktailRecipe = require('../models/CocktailRecipe');
const axios = require('axios');

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
    const drinkId = req.query.id;
    const drink = await CocktailRecipe.findById(drinkId);
    const ingredients = drink.ingredients;
    const instructions = drink.instructions;
    res.render('cocktail-information', { title: 'Cocktail', drink, ingredients, instructions, editable: true });
  } catch (error) {
    res.status(500).json({ message: 'Error getting recipe for cocktail' });
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