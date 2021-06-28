const controller = require('../controllers/dev.controllers')
const router = require('express').Router()

router.get('/version', controller.getVersion)

router.get('/todos', controller.getTodos)

module.exports = router
