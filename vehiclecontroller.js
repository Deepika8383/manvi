const axios = require('axios');
const {Vehicle, Org} = require('./db');
//const Org = require('../models/Org');
const cache = new Map();
const RATE_LIMIT = 5; // Max 5 requests per minute

let requestCounter = 0;
let resetTime = Date.now() + 60000;

async function decodeVIN(vin) {
  const currentTime = Date.now();
  if (currentTime > resetTime) {
    resetTime = currentTime + 60000;
    requestCounter = 0;
  }

  if (requestCounter >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Try again later.');
  }

  if (cache.has(vin)) {
    return cache.get(vin);
  }

  const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
  const { Results } = response.data;
  const vehicleData = {
    manufacturer: Results[7].Value,
    model: Results[9].Value,
    year: Results[10].Value,
  };

  cache.set(vin, vehicleData);
  requestCounter++;
  return vehicleData;
}

exports.decodeVehicle = async (req, res) => {
  const { vin } = req.params;
  try {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return res.status(400).json({ error: 'Invalid VIN' });
    }
    const vehicle = await decodeVIN(vin);
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addVehicle = async (req, res) => {
  const { vin, org } = req.body;
  try {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return res.status(400).json({ error: 'Invalid VIN' });
    }

    const orgExists = await Org.findById(org);
    if (!orgExists) {
      return res.status(400).json({ error: 'Organization not found' });
    }

    const vehicleData = await decodeVIN(vin);
    const vehicle = new Vehicle({ vin, ...vehicleData, org });
    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVehicle = async (req, res) => {
  const { vin } = req.params;
  try {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return res.status(400).json({ error: 'Invalid VIN' });
    }

    const vehicle = await Vehicle.findOne({ vin }).populate('org');
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
