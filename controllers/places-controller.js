const fs = require('fs')
const mongoose = require('mongoose')
const HttpError = require('../models/http-error')
const Place = require('../models/place')
const User = require('../models/user')

const getCoordsForAddress = require('../utils/location')
const {
  createPlaceValidator,
  updatePlaceValidator
} = require('../utils/places-validator')

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
  //Commented lines are an alternative way to
  //get the places using populate mongoose function.
  const userId = req.params.userId
  let places

  // let userWithPlaces
  try {
    places = await Place.find({ creator: userId })
    // userWithPlaces = await User.findById(userId).populate('places')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find places',
      500
    )
    next(error)
  }

  if (!places || places.length === 0) {
    // if (!userWithPlaces.places || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    )
  }
  return res.json({
    places: places.map(place => place.toObject({ getters: true }))
    // places: userWithPlaces.places.map(place => place.toObject({ getters: true }))
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

  let user
  try {
    user = await User.findById(creator)
  } catch (err) {
    const error = new HttpError('Could not find user for provided id', 404)
    return next(error)
  }
  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404)
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    image: req.file.path,
    address,
    location: coordinates,
    creator
  })

  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    await createdPlace.save({ session })
    user.places.push(createdPlace)
    await user.save({ session })
    await session.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, plase try it again',
      500
    )
    return next(error)
  }

  return res
    .status(201)
    .json({ place: createdPlace.toObject({ getters: true }) })
}

const updatePlace = async (req, res, next) => {
  const placeId = req.params.placeId
  const { userId } = req.userData
  const validator = updatePlaceValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { title, description, address } = req.body

  let location
  try {
    location = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Updating place failed, plase try it again',
      500
    )
    return next(error)
  }

  if (place.creator.toString() !== userId) {
    const error = new HttpError('You are not allowed to edit this place', 401)
    return next(error)
  }

  place.title = title
  place.description = description
  place.address = address
  place.location = location

  try {
    await place.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    )
    return next(error)
  }

  return res.json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId
  const { userId } = req.userData

  let place
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (err) {
    const error = new HttpError(
      'Could not find a place for the provided id',
      404
    )
    return next(error)
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id',
      404
    )
    return next(error)
  }

  if (place.creator.id !== userId) {
    const error = new HttpError('You are not allowed to delete this place', 401)
    return next(error)
  }

  const imagePath = place.image

  try {
    const session = await mongoose.startSession()
    session.startTransaction()
    place.creator.places.pull(place)
    await place.creator.save({ session })
    await place.remove({ session })
    await session.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    )
    return next(error)
  }

  fs.unlink(imagePath, err => {
    console.log(err)
  })

  return res.json({ message: 'The place was deleted successfully.' })
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
}
