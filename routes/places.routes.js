const express = require('express')
const router = express.Router()

const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/places-controller')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

router.get('/:placeId', getPlaceById)
router.get('/user/:userId', getPlacesByUserId)

router.use(checkAuth)

router.post('/', fileUpload.single('image'), createPlace)
router.patch('/:placeId', updatePlace)
router.delete('/:placeId', deletePlace)

module.exports = router
