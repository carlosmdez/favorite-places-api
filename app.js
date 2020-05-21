const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const placesRoutes = require('./routes/places.routes')
const usersRoutes = require('./routes/users.routes')
const HttpError = require('./models/http-error')
const sanitizeData = require('./utils/sanitizeData')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  req.body = sanitizeData(req.body)
  next()
})

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }

  res.status(error.code || 500)
  res.json({ message: error.message } || 'An unknown error ocurred!')
})

const user = 'carlos'
const pass = 'onepiece'
const project = 'places-app'
const uri = `mongodb+srv://${user}:${pass}@shanksdb-gyptc.mongodb.net/${project}?retryWrites=true&w=majority`

mongoose
  .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('Database connected successfully.')
    app.listen(5000)
  })
  .catch(err => {
    console.log('Database connection failed.')
    console.log(err)
  })
