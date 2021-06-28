const controller = require('../controllers/users.controllers')
const router = require('express').Router()
const { protect } = require('../middlewares/authMiddleware')
const {
  multerUploadMiddleWare,
} = require('../middlewares/imageUploadMiddleware')
const { resizeImage } = require('../middlewares/imageResizeMiddleware')

router
  .get('/', protect, controller.getAllUsers)
  .get('/user/:username', controller.getOneUser)
  .post('/', controller.registerUser)
  .get('/profile', protect, controller.getUserProfile)
  .put('/profile', protect, controller.updateUserProfile)
  .post('/login', controller.authUser)
  .get('/favourites', protect, controller.getFavourites)
  .post('/favourites', protect, controller.addFavourites)
  .delete('/favourites', protect, controller.deleteFavourites)
  .post('/search', protect, controller.getSearchUsers)
// .delete('/:username', controller.deleteOneUser)

module.exports = router
