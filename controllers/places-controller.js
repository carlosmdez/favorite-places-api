const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../utils/location')
const {
  createPlaceValidator,
  updatePlaceValidator
} = require('../utils/places-validator')
const Place = require('../models/place')

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'An amazing place to eat.',
    imageUrl: 'https://bit.ly/396w3Wx',
    address: 'West 34th Street, New York, NY, USA',
    location: {
      lat: 40.748441,
      lng: -73.9856673
    },
    creator: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'An amazing place to eat.',
    imageUrl: 'https://bit.ly/396w3Wx',
    address: 'West 34th Street, New York, NY, USA',
    location: {
      lat: 40.7491775,
      lng: -73.9928418
    },
    creator: 'u2'
  }
]

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId
  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place',
      500
    )
    next(error)
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id',
      404
    )
    next(error)
  }

  return res.json({ place: place.toObject({ getters: true }) })
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId
  let places
  try {
    places = await Place.find({ creator: userId })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find places',
      500
    )
    next(error)
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    )
  }
  return res.json({
    places: places.map(place => place.toObject({ getters: true }))
  })
}

const createPlace = async (req, res, next) => {
  const validator = createPlaceValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { title, description, address, creator } = req.body
  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Vue_de_nuit_de_la_Place_Stanislas_%C3%A0_Nancy.jpg/1088px-Vue_de_nuit_de_la_Place_Stanislas_%C3%A0_Nancy.jpg',
    address,
    location: coordinates,
    creator
  })

  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, plase try it again',
      500
    )
    return next(error)
  }

  return res.status(201).json(createdPlace)
}

const updatePlace = async (req, res, next) => {
  const placeId = req.params.placeId
  const validator = updatePlaceValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { title, description } = req.body
  let place
  try {
    place = await Place.findByIdAndUpdate(
      placeId,
      { title, description },
      { new: true }
    )
  } catch (err) {
    const error = new HttpError(
      'Updating place failed, plase try it again',
      500
    )
    return next(error)
  }
  return res.json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId

  let place
  try {
    place = await Place.findByIdAndRemove(placeId)
  } catch (err) {
    const error = new HttpError(
      'Could not find a place for the provided id',
      404
    )
    return next(error)
  }
  return res.json({ message: 'The place was deleted successfully.' })
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
}
