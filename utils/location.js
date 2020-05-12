const axios = require('axios')
const HttpError = require('../models/http-error')

const API_KEY = 'AIzaSyDpD-OD2tOQxehYm4phDvUkXtbny8QAyBc'

const getCoordsForAddress = async address => {
  address = address.trim()
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  )
  const data = response.data
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specifed address.',
      422
    )
  }

  const coordinates = data.results[0].geometry.location
  return coordinates
}

module.exports = getCoordsForAddress
