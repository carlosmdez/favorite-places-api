const express = require('express')
const router = express.Router()

const {
  getAllUsers,
  signup,
  login
} = require('../controllers/users-controller')
const fileUpload = require('../middleware/file-upload')

router.get('/', getAllUsers)
router.post('/signup', fileUpload.single('image'), signup)
router.post('/login', login)

module.exports = router
