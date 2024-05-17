const express = require('express');
const router = express.Router();
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const recipeController = require('../controllers/cocktailRecipeController');
const drinksController = require('../controllers/cocktailDownloading');
const accountController = require('../controllers/accountController');

router.get('*', checkUser);
router.get('/', recipeController.getDrinks);
router.get('/info-for-drink', requireAuth, recipeController.getCocktailRecipeById);
router.get('/search', recipeController.searchCocktailByName);

router.get('/add', requireAuth, recipeController.getAddingRecipe);
router.post('/add', requireAuth, recipeController.postAddingRecipe);
router.get('/edit', requireAuth, recipeController.getEditingRecipe);
router.post('/edit', requireAuth, recipeController.postEditingRecipe)

router.post('/toggle-favorite', requireAuth, checkUser, recipeController.toggleFavorite)
router.post('/info-for-drink', requireAuth, checkUser, recipeController.postingComment);

// router.get('/download-drinks', drinksController.downloadCocktailsToDB);
router.get('/all', drinksController.listOfCocktails);

router.get('/signup', accountController.getSignUpUser);
router.get('/login', accountController.getLoginUser);
router.post('/signup', accountController.postingSignup);
router.post('/login', accountController.postingLogin);
router.get('/logout', accountController.getLogoutUser);

module.exports = router;
