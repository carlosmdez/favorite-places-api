const Ajv = require('ajv')
const HttpError = require('../models/http-error')

const ajv = new Ajv({ allErrors: true })

const signupSchema = {
  properties: {
    name: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  },
  required: ['name', 'email', 'password']
}

const loginSchema = {
  properties: {
    email: { type: 'string', minLength: 5, format: 'email' },
    password: { type: 'string', minLength: 6 }
  },
  required: ['email', 'password']
}

const validateSignup = ajv.compile(signupSchema)
const validateLogin = ajv.compile(loginSchema)

const signupValidator = data => {
  const valid = validateSignup(data)
  const response = { isValid: valid, error: null }
  if (valid) {
    response.isValid = true
  } else {
    response.error = new HttpError(
      `Invalid input: ${ajv.errorsText(validateSignup.errors)}`,
      422
    )
  }
  return response
}

const loginValidator = data => {
  const valid = validateLogin(data)
  const response = { isValid: valid, error: null }
  if (valid) {
    response.isValid = true
  } else {
    response.error = new HttpError(
      `Invalid input: ${ajv.errorsText(validateLogin.errors)}`,
      422
    )
  }
  return response
}

module.exports = {
  signupValidator,
  loginValidator
}
