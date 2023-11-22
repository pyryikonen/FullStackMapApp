// Importing required modules and middleware
const express = require('express')
const router = express.Router()
const database = require('../database/databaseFunctions.js') // Importing the database methods
const {
  validateLocation,
  validateId,
  validateUpdate,
} = require('../validation/validation.js') // Importing validation middleware

// GET method to fetch all locations
router.get('/', async (req, res) => {
  try {
    // Fetch all locations from the database
    const locations = await database.findAll()
    // Respond with a JSON array of locations
    res.json(locations)
  } catch (error) {
    // Handle server error with a 500 status and a JSON response
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// GET method to fetch a location by ID
router.get('/:myId([0-9]+)', validateId, async (req, res) => {
  const id = req.params.myId
  try {
    // Fetch a location by ID from the database
    const location = await database.findById(id)
    // Respond with a JSON object representing the location
    res.json(location)
  } catch (error) {
    // Handle server error with a 500 status and a JSON response
    res.status(500).json({ error: error.message })
  }
})

// DELETE method to remove a location by ID
router.delete('/:myId([0-9]+)', validateId, async (req, res) => {
  const id = parseInt(req.params.myId) // Keep the ID as an integer
  try {
    // Delete a location by ID from the database
    await database.deleteById(id)
    // Respond with a 204 status (No Content) indicating successful deletion
    res.status(204).end()
  } catch (error) {
    // Handle server error with a 500 status and a JSON response
    res.status(500).json({ error: error.message })
  }
})

// DELETE method to remove all locations
router.delete('/', async (req, res) => {
  try {
    // Clear the entire database of locations
    await database.clearDatabase()
    // Respond with a 204 status (No Content) indicating successful deletion
    res.status(204).end()
  } catch (error) {
    // Handle server error with a 500 status and a JSON response
    res.status(500).json({ error: error.message })
  }
})

// POST method to add a new location
router.post('/', validateLocation, async (req, res) => {
  try {
    // Extract the location data from the request body
    const dataToSave = req.body
    // Save the new location to the database
    const savedLocation = await database.save(dataToSave)
    // Respond with the saved location and a 201 status (Created)
    res.status(201).json(savedLocation)
  } catch (error) {
    // Handle server error with a 500 status and a JSON response
    res.status(500).json({ error: error.message })
  }
})

// PUT method to update a location by ID
router.put(
  '/:myId([0-9]+)',
  validateUpdate,
  validateLocation,
  async (req, res) => {
    try {
      // Extract the location data from the request body
      const dataToPut = req.body
      // Save the updated location to the database
      const putLocation = await database.save(dataToPut)
      // Respond with the updated location and a 200 status (OK)
      res.status(200).json(putLocation)
    } catch (error) {
      // Handle server error with a 500 status and a JSON response
      res.status(500).json({ error: error.message })
    }
  },
)

// PATCH method to partially update a location by ID
router.patch(
  '/:myId([0-9]+)',
  validateUpdate,
  validateLocation,
  async (req, res) => {
    const id = parseInt(req.params.myId)
    try {
      // Validate ID and find the existing location in the database
      const existingLocation = await database.findById(id)
      // Update the location based on the provided fields in the request body
      if (req.body.latitude !== undefined) {
        existingLocation.latitude = req.body.latitude
      }
      if (req.body.longitude !== undefined) {
        existingLocation.longitude = req.body.longitude
      }
      // Save the updated location back to the database
      await database.save(existingLocation)
      // Respond with a success message and the updated location
      res.status(200).json({
        message: 'Location updated successfully',
        location: existingLocation,
      })
    } catch (error) {
      // Handle errors, e.g., validation errors or location not found
      res.status(400).json({ error: error.message })
    }
  },
)

// Export the router for use in other parts of the application
module.exports = router
