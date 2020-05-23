const HttpError = require('../models/http-error')

const { signupValidator, loginValidator } = require('../utils/users-validator')
const User = require('../models/user')

const getAllUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching users fail, please try again later',
      500
    )
    return next(error)
  }
  return res.json({
    users: users.map(user => user.toObject({ getters: true }))
  })
}

const signup = async (req, res, next) => {
  const validator = signupValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { name, email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    )
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead',
      422
    )
    return next(error)
  }
  const createdUser = new User({
    name,
    email,
    password,
    image:
      'https://cdn3.f-cdn.com/contestentries/1376995/30494909/5b566bc71d308_thumb900.jpg',
    places: []
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    )
    return next(error)
  }
  return res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
  const validator = loginValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { email, password } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    const error = new HttpError('Loging in failed, please try again later', 500)
    return next(error)
  }

  //Dummy validation
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in',
      401
    )
    return next(error)
  }
  return res.json({ message: 'Logged in!' })
}

module.exports = {
  getAllUsers,
  signup,
  login
}
