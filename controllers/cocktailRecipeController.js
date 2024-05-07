const CocktailRecipe = require('../models/CocktailRecipe');
const axios = require('axios');


exports.getRandomDrinks = async (req, res) => {
  try {
    const response = await Promise.all([
      axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    ]);    
    const drinks = response.map(response => ({
      name: response.data.drinks[0].strDrink,
      imageUrl: `${response.data.drinks[0].strDrinkThumb}/preview`
    }));
    randomDrinkData = response.map(response => response.data.drinks[0].idDrink);
    res.render('main', { title: 'Cocktails', drinks, randomDrinkData });
  } catch (error) {
    res.status(500).json({ message: 'Error getting random drink'})
  }
};

exports.getCocktailRecipeById = async (req, res) => {
  try {
    const orderId = req.query.id;
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${orderId}`);
    const drink = {
      name: response.data.drinks[0].strDrink,
      imageUrl: `${response.data.drinks[0].strDrinkThumb}/preview`,
      ingredients: Object.keys(response.data.drinks[0])
        .filter(key => key.startsWith('strIngredient') && response.data.drinks[0][key])
        .map((key, index) => ({
          name: response.data.drinks[0][key],
          imageUrl: `https://www.thecocktaildb.com/images/ingredients/${response.data.drinks[0][key]}.png`,
          measurements: response.data.drinks[0][`strMeasure${index + 1}`]
        })),        
      instructions: response.data.drinks[0].strInstructions
    };
    res.render('cocktail-information', { title: 'Cocktail', drink, editable: true });
  } catch (error) {
    res.status(500).json({ message: 'Error getting recipe for cocktail' });
  }
};


exports.searchCocktailByName = async (req, res) => {
  const name = req.query.name;
  try {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
    const drinks = response.data.drinks.map(drink => ({
      name: drink.strDrink,
      imageUrl: `${drink.strDrinkThumb}/preview`,
      idDrink: drink.idDrink
    }));
    res.render('search-result', { title: 'Cocktails', drinks });
  } catch (error) {
    res.status(500).json({ message: 'Error searching cocktails by name' });
  }
};