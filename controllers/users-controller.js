const HttpError = require('../models/http-error')
const uniqid = require('uniqid')

const { signupValidator, loginValidator } = require('../utils/users-validator')

const USERS = [
  {
    id: 'u1',
    name: 'Carlos Méndez',
    email: 'carlos@gmail.com',
    password: 'carlos'
  },
  {
    id: 'u2',
    name: 'John Arreola',
    email: 'juan@gmail.com',
    password: 'juan'
  },
  {
    id: 'u3',
    name: 'Jofran Benítez',
    email: 'jofran@gmail.com',
    password: 'jofran'
  }
]

const getAllUsers = (req, res, next) => {
  if (USERS.length > 0) {
    return res.json({ users: USERS })
  }
  next(new HttpError('Could not find any user', 404))
}

const signup = (req, res, next) => {
  const validator = signupValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { name, email, password } = req.body
  const hasUser = USERS.find(user => user.email === email)
  if (hasUser) {
    throw new HttpError('Could not create user, email already exist', 409)
  }
  const createdUser = {
    id: uniqid(),
    name,
    email,
    password
  }
  USERS.push(createdUser)
  return res.status(201).json(createdUser)
}

const login = (req, res, next) => {
  const validator = loginValidator(req.body)
  if (!validator.isValid) {
    return next(validator.error)
  }
  const { email, password } = req.body
  const selectedUser = USERS.find(user => user.email === email)
  if (!selectedUser || selectedUser.password !== password) {
    return next(
      new HttpError('The username and password entered do not match', 401)
    )
  }
  return res.json({ message: 'Logged in!' })
}

module.exports = {
  getAllUsers,
  signup,
  login
}
