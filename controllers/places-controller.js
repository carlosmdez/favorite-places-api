const HttpError = require('../models/http-error')
var uniqid = require('uniqid');

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

  res.json({ place })
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId
  const places = DUMMY_PLACES.filter(place => place.creator === userId)
  if (places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id', 404)
    )
  }
  res.json({ places })
}

const createPlace = (req, res, next) => {
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
  res.status(201).json(createdPlace)
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace
}
