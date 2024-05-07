const CocktailRecipe = require('../models/CocktailRecipe');
const axios = require('axios');

exports.downloadCocktailsToDB = async function(req, res, next) {
  try {
    for (let letter of 'abcdefghijklmnopqrstuvwxyz') {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
      const cocktailData = response.data;
      if (cocktailData.drinks) {
        for (let i = 0; i < cocktailData.drinks.length; i++) {
          let cocktail = {
            name: cocktailData.drinks[i].strDrink,
            ingredients: Object.keys(cocktailData.drinks[i])
              .filter(key => (key.startsWith('strIngredient') && cocktailData.drinks[i][key]))
              .map(key => cocktailData.drinks[i][key])
          };
          try {
            const result = await CocktailRecipe.insertMany(cocktail);
            console.log(result);
          } catch (error) {
            console.error('Error creating cocktail recipe:', error);
          }
        }
      }
    }
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${i}`);
      const cocktailData = response.data;
      if (cocktailData.drinks) {
        for (let i = 0; i < cocktailData.drinks.length; i++) {
          let recipe = {
            name: cocktailData.drinks[i].strDrink,
            ingredients: Object.keys(cocktailData.drinks[i])
              .filter(key => (key.startsWith('strIngredient') && cocktailData.drinks[i][key]))
              .map(key => cocktailData.drinks[i][key])
          };
          try {
            const result = await CocktailRecipe.create(recipe);
            console.log(result);
          } catch (error) {
            console.error('Error creating cocktail recipe:', error);
          }
        }
      }
    }
    res.json({ message: 'Cocktails downloaded and saved to database successfully.' });
  } catch (error) {
    console.error('Error fetching cocktails:', error);
    next(error);
  }
};

exports.listOfCocktails = async (req, res) => {
  const drinks = await CocktailRecipe.find({})
  res.json(drinks);
}