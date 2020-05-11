const express = require('express')
const router = express.Router()

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/places-controller')


router.get('/:placeId', getPlaceById)
router.get('/user/:userId', getPlacesByUserId)
router.post('/', createPlace)
router.patch('/:placeId', updatePlace)
router.delete('/:placeId', deletePlace)

module.exports = router
