// Importing the 'yup' library for data validation
const yup = require('yup')

// Validation schema for location: latitude and longitude
const locationSchema = yup.object().shape({
  latitude: yup
    .number()
    .min(-90, 'Latitude must be greater than or equal to -90')
    .max(90, 'Latitude must be less than or equal to 90'),
  longitude: yup
    .number()
    .min(-180, 'Longitude must be greater than or equal to -180')
    .max(180, 'Longitude must be less than or equal to 180'),
})

// Validation schema for ID
const idSchema = yup.object().shape({
  id: yup
    .number()
    .integer()
    .min(0, 'ID must be a non-negative integer')
    .required()
    .strict(),
})

// Validation schema for PUT and PATCH requests
const updateSchema = yup.object().shape({
  latitude: yup
    .number()
    .min(-90, 'Latitude must be greater than or equal to -90')
    .max(90, 'Latitude must be less than or equal to 90'),
  longitude: yup
    .number()
    .min(-180, 'Longitude must be greater than or equal to -180')
    .max(180, 'Longitude must be less than or equal to 180'),
})

// Middleware to validate the structure of location data for POST requests
const validateLocation = (req, res, next) => {
  const { error } = locationSchema.validate(req.body, { strict: true })
  if (error) {
    return res.status(400).json({ error: error.message })
  }
  next()
}
// Middleware to validate the format of an ID for GET and DELETE requests
const validateId = (req, res, next) => {
  const { error } = idSchema.validate(
    { id: parseInt(req.params.myId) },
    { strict: true },
  )
  if (error) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  next()
}

// Middleware to validate the structure of location data for PUT and PATCH requests
const validateUpdate = (req, res, next) => {
  const { error } = updateSchema.validate(req.body, { strict: true })
  if (error) {
    return res.status(400).json({ error: error.message })
  }
  next()
}

module.exports = {
  validateLocation,
  validateId,
  validateUpdate,
}
