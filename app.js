const express = require('express');
//const connectDB = require('./config/db');
const vehicleRoutes = require('./vehiclerouter');
const orgRoutes = require('./orgroutes');
const rateLimit = require('./ratelimitMiddle');
console.log("1");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Rate limiting middleware for NHTSA API calls
app.use('/vehicles/decode/:vin', rateLimit(5, 60000));

// Routes
app.use('/vehicles', vehicleRoutes);
app.use('/orgs', orgRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
