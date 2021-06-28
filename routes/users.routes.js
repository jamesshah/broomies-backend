const controller = require('../controllers/users.controllers')
const router = require('express').Router()
const { protect } = require('../middlewares/authMiddleware')

router
  .get('/', protect, controller.getAllUsers)
  .post('/', controller.registerUser)
  .get('/user/:username', controller.getOneUser)
  .get('/profile', protect, controller.getUserProfile)
  .put('/profile', protect, controller.updateUserProfile)
  .post('/login', controller.authUser)
  .get('/favourites', protect, controller.getFavourites)
  .post('/favourites', protect, controller.addFavourites)
  .delete('/favourites', protect, controller.deleteFavourites)
  .post('/search', protect, controller.getSearchUsers)

module.exports = router
