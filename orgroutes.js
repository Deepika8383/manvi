const express = require('express');
const { createOrg, updateOrg, getAllOrgs } = require('./orgcontroller');

const router = express.Router();

// Create a new organization
router.post('/', createOrg);

// Update an existing organization
router.patch('/:id', updateOrg);

// Get all organizations
router.get('/', getAllOrgs);

module.exports = router;
