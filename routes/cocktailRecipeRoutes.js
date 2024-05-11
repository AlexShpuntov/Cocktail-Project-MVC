const express = require('express');
const router = express.Router();
const CocktailRecipe = require('../models/CocktailRecipe');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const recipeController = require('../controllers/cocktailRecipeController');
const drinksController = require('../controllers/cocktailDownloading');
const accountController = require('../controllers/accountController');

router.get('*', checkUser);
router.get('/', recipeController.getRandomDrinks);
router.get('/info-for-drink', requireAuth, recipeController.getCocktailRecipeById);
router.get('/search', recipeController.searchCocktailByName);

router.get('/download-drinks', drinksController.downloadCocktailsToDB);
router.get('/all', drinksController.listOfCocktails);

router.get('/signup', accountController.getSignUpUser);
router.get('/login', accountController.getLoginUser);
router.post('/signup', accountController.postingSignup);
router.post('/login', accountController.postingLogin);
router.get('/logout', accountController.getLogoutUser);

module.exports = router;
