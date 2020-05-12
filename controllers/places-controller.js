const HttpError = require('../models/http-error')
const uniqid = require('uniqid')

const {
  createPlaceValidator,
  updatePlaceValidator
} = require('../utils/places-validator')

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

const getPlaceById = (req, res) => {
  const placeId = req.params.placeId
  const place = DUMMY_PLACES.find(place => place.id === placeId)
  if (!place) {
    throw new HttpError('Could not find a place for the provided id', 404)
  }

  return res.json({ place })
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId
  const places = DUMMY_PLACES.filter(place => place.creator === userId)
  if (places.length === 0 || !places) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    )
  }
  return res.json({ places })
}

const createPlace = (req, res, next) => {
  const validator = createPlaceValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { title, description, coordinates, address, creator } = req.body
  const createdPlace = {
    id: uniqid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }
  DUMMY_PLACES.push(createdPlace)
  return res.status(201).json(createdPlace)
}

const updatePlace = (req, res, next) => {
  const placeId = req.params.placeId
  const validator = updatePlaceValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { title, description } = req.body
  const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
  if (placeIndex > -1) {
    updatedPlace.title = title
    updatedPlace.description = description
    DUMMY_PLACES[placeIndex] = updatedPlace
    return res.json({ place: updatedPlace })
  }
  return next(new HttpError('Could not find a place for the provided id', 404))
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId)
  if (placeIndex > -1) {
    DUMMY_PLACES.splice(placeIndex, 1)
    return res.json({ message: 'The place was deleted successfully.' })
  }
  return next(new HttpError('Could not find a place for the provided id', 404))
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
}
