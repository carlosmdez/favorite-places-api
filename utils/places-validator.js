const Ajv = require('ajv')
const HttpError = require('../models/http-error')

const ajv = new Ajv({ allErrors: true })

const createPlaceSchema = {
  properties: {
    title: { type: 'string', minLength: 3 },
    description: { type: 'string', minLength: 3 },
    address: { type: 'string', minLength: 3 },
  },
  required: ['title', 'description', 'address']
}

const updatePlaceSchema = {
  properties: {
    title: { type: 'string', minLength: 3 },
    description: { type: 'string', minLength: 3 },
    address: { type: 'string', minLength: 3 }
  },
  required: ['title', 'description', 'address']
}

const validateCreatePlace = ajv.compile(createPlaceSchema)
const validateUpdatePlace = ajv.compile(updatePlaceSchema)

const createPlaceValidator = data => {
  const valid = validateCreatePlace(data)
  const response = { isValid: valid, error: null }
  if (valid) {
    response.isValid = true
  } else {
    response.error = new HttpError(
      `Invalid input: ${ajv.errorsText(validateCreatePlace.errors)}`,
      422
    )
  }
  return response
}

const updatePlaceValidator = data => {
  const valid = validateUpdatePlace(data)
  const response = { isValid: valid, error: null }
  if (valid) {
    response.isValid = true
  } else {
    response.error = new HttpError(
      `Invalid input: ${ajv.errorsText(validateUpdatePlace.errors)}`,
      422
    )
  }
  return response
}

module.exports = {
  createPlaceValidator,
  updatePlaceValidator
}
