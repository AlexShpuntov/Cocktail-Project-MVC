const CocktailRecipe = require('../models/CocktailRecipe');
const UserAccount = require('../models/UserAccount');

let drinkId;

exports.getDrinks = async (req, res) => {
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
    let favoriteDrinks = [];
    if (res.locals.user) {
      const user = await UserAccount.findById(res.locals.user._id);
      if (user && user.favoriteCocktails.length > 0) {
        favoriteDrinks = await CocktailRecipe.find({
          _id: { $in: user.favoriteCocktails }
        }).select('_id name imageUrl');
      }
    }
    res.render('main', { title: 'Cocktails', drinks, favoriteDrinks });
  } catch (error) {
    res.status(500).json({ message: 'Error getting drinks' });
  }
};


exports.toggleFavorite = async (req, res) => {
  const userId = res.locals.user._id;
  const { drinkId } = req.body;
  try {
    const user = await UserAccount.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const index = user.favoriteCocktails.indexOf(drinkId);
    let isFavorite;

    if (index > -1) {
      user.favoriteCocktails.splice(index, 1);
      isFavorite = false;
    } else {
      user.favoriteCocktails.push(drinkId);
      isFavorite = true;
    }
    await UserAccount.updateOne({ _id: userId }, { favoriteCocktails: user.favoriteCocktails });
    res.status(200).json({ success: true, isFavorite });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCocktailRecipeById = async (req, res) => {
  const userId = res.locals.user._id;
  try {
    drinkId = req.query.id;
    const drink = await CocktailRecipe.findById(drinkId);
    const user = await UserAccount.findById(userId);
    const isFavorite = user.favoriteCocktails.includes(drinkId);
    const ingredients = drink.ingredients;
    const instructions = drink.instructions;
    const commentReviews = drink.comments;
    res.render('cocktail-information', { title: 'Cocktail', drink, ingredients, instructions, commentReviews, isFavorite });
  } catch (error) {
    res.status(500).json({ message: 'Error getting recipe for cocktail' });
  }
};

exports.postingComment = async (req, res) => {
  try {
    const text = req.body.comment;
    const commenter = res.locals.user.name;
    const rating = req.body.rating;
    const recipe = await CocktailRecipe.findById(drinkId);
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    recipe.comments.push({ commenter, text, rating });
    await recipe.save();
    await recipe.calculateAverageRating();
    res.status(201).json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

exports.getAddingRecipe = async (req, res) => {
  try {
    res.render('add-recipe', {edit: false });
  } catch (error) {
    res.status(500).json({ message: 'Error getting Add-cocktail page' });
  }
};

exports.postAddingRecipe = async (req, res) => {
  const { drinkName, drinkImage, ingredientImage, ingredientName, ingredientMeasurements, instructions } = req.body;
  try {
    const names = Array.isArray(ingredientName) ? ingredientName : [ingredientName];
    const images = Array.isArray(ingredientImage) ? ingredientImage : [ingredientImage];
    const measurements = Array.isArray(ingredientMeasurements) ? ingredientMeasurements : [ingredientMeasurements];
    const ingredients = names.map((name, index) => ({
      name: name,
      imageUrl: images[index],
      measurements: measurements[index]
    }));
    const drink = {
      name: drinkName,
      imageUrl: drinkImage,
      ingredients: ingredients,
      instructions: instructions
    };
    const result = await CocktailRecipe.insertMany(drink);
    res.status(201).redirect(`/info-for-drink?id=${result[0]._id}`);
  } catch (error) {
    res.status(500).json({ message: 'Error posting cocktail' });
  }
};

exports.getEditingRecipe = async (req, res) => {
  try {
    const drink = await CocktailRecipe.findById(drinkId);
    if (!drink) {
      return res.status(404).send('Cocktail not found');
    }
    res.render('add-recipe', {edit: true, drink});
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

exports.postEditingRecipe = async (req, res) => {
  const { drinkName, drinkImage, ingredientImage, ingredientName, ingredientMeasurements, instructions } = req.body;
  try {
    const names = Array.isArray(ingredientName) ? ingredientName : [ingredientName];
    const images = Array.isArray(ingredientImage) ? ingredientImage : [ingredientImage];
    const measurements = Array.isArray(ingredientMeasurements) ? ingredientMeasurements : [ingredientMeasurements];
    const ingredients = names.map((name, index) => ({
      name: name,
      imageUrl: images[index],
      measurements: measurements[index]
    }));
    const drink = await CocktailRecipe.updateOne(
      { _id: drinkId },
      { $set: {
          name: drinkName,
          imageUrl: drinkImage, 
          "ingredients": ingredients,
          instructions: instructions
      }}
    );
    res.status(201).redirect(`/info-for-drink?id=${drinkId}`);
  } catch (error) {
    console.error(error);
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