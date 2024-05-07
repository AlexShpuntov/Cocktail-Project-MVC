const express = require('express');
const router = express.Router();
const CocktailRecipe = require('../models/CocktailRecipe');
const recipeController = require('../controllers/cocktailRecipeController');
const drinksController = require('../controllers/cocktailDownloading');
const accountController = require('../controllers/accountController')

router.get('/', recipeController.getRandomDrinks);
router.get('/info-for-drink', recipeController.getCocktailRecipeById);
router.get('/search', recipeController.searchCocktailByName);

router.get('/download-drinks', drinksController.downloadCocktailsToDB);
router.get('/all', drinksController.listOfCocktails);

router.get('/signup', accountController.getSignUpUser);
router.get('/login', accountController.getLoginUser);
router.post('/signup', accountController.postingSignup);
router.post('/login', accountController.postingLogin);
// router.get('/:id', getRecipe, (req, res) => {
//   res.render(res.data);
// });

// async function getRecipe(req, res, next) {
//   let recipe;
//   try {
//     recipe = await CocktailRecipe.findById(req.params.id);
//     if (recipe == null) {
//       return res.status(404).json({ message: 'Recipe not found' });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
//   res.recipe = recipe;
//   next();
// }

module.exports = router;
