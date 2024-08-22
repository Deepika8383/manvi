const express = require('express');
const { decodeVehicle, addVehicle, getVehicle } = require('./vehiclecontroller');

const router = express.Router();

// Decode a VIN and return vehicle details
router.get('/decode/:vin', decodeVehicle);

// Add a vehicle to the system
router.post('/', addVehicle);

// Get a vehicle's details by VIN
router.get('/:vin', getVehicle);

module.exports = router;
