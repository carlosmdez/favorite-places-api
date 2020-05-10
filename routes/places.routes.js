const express = require('express')
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace
} = require('../controllers/places-controller')

const router = express.Router()

router.get('/:placeId', getPlaceById)
router.get('/user/:userId', getPlacesByUserId)
router.post('/', createPlace)

module.exports = router
