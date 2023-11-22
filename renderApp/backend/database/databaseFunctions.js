const mysql = require('mysql')
const yup = require('yup')
const pool = require('../dbConfig') // Use dbConfig.js

const locationSchema = yup.object().shape({
  latitude: yup.number().required(),
  longitude: yup.number().required(),
})

const idSchema = yup.object().shape({
  id: yup.number().integer().positive().required(),
})

const validateLocation = (location) => {
  return locationSchema.validate(location)
}

const validateId = (id) => {
  return idSchema.validate({ id })
}

const queryDatabase = async (query, values = []) => {
  try {
    console.log('Executing query:', query, 'with values:', values)
    const [results] = await pool.execute(query, values)
    console.log('Query results:', results)
    return results
  } catch (error) {
    console.error(`Error in queryDatabase: ${error.message}`)
    throw error
  }
}

const findAll = async () => {
  try {
    const query = 'SELECT * FROM locations'
    const locations = await queryDatabase(query)
    return locations
  } catch (error) {
    console.error(`Error in findAll: ${error.message}`)
    throw error
  }
}

const findById = async (id) => {
  try {
    await validateId(id)
    const query = 'SELECT * FROM locations WHERE id = ?'
    const results = await queryDatabase(query, [id])

    if (results.length === 0) {
      throw new Error('Location with specified ID not found')
    }

    return results[0]
  } catch (error) {
    console.error(`Error in findById: ${error.message}`)
    throw error
  }
}

const deleteById = async (id) => {
  try {
    await validateId(id)
    const query = 'DELETE FROM locations WHERE id = ?'
    const results = await queryDatabase(query, [id])

    if (results.affectedRows === 0) {
      throw new Error('Location with specified ID not found')
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in deleteById: ${error.message}`)
    throw error
  }
}

const save = async (location) => {
  try {
    const { error } = validateLocation(location)

    if (error) {
      throw new Error(error.message)
    }

    const query = 'INSERT INTO locations (latitude, longitude) VALUES (?, ?)'
    const results = await queryDatabase(query, [
      location.latitude,
      location.longitude,
    ])

    const newLocation = {
      id: results.insertId,
      latitude: location.latitude,
      longitude: location.longitude,
    }

    return newLocation
  } catch (error) {
    console.error(`Error in save: ${error.message}`)
    throw error
  }
}

const clearDatabase = async () => {
  try {
    const query = 'DELETE FROM locations'
    const results = await queryDatabase(query)

    if (results.affectedRows === 0) {
      throw new Error('No rows found to delete')
    }

    return { success: true }
  } catch (error) {
    console.error(`Error in clearDatabase: ${error.message}`)
    throw error
  }
}

module.exports = {
  validateLocation,
  validateId,
  findAll,
  findById,
  deleteById,
  clearDatabase,
  save,
}
