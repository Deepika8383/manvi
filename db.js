
// Create a Schema for Users

const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect("apply ypur url here thats all ");

const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true, length: 17 },
    manufacturer: String,
    model: String,
    year: Number,
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' }
});
  
const Vehicle = mongoose.model('Vehicle', vehicleSchema);


const orgSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    account: String,
    website: String,
    fuelReimbursementPolicy: { type: String, default: '1000' },
    speedLimitPolicy: String,
    parentOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Org' }]
});
  
orgSchema.pre('save', async function(next) {
    if (this.parentOrg) {
      const parent = await this.model('Org').findById(this.parentOrg);
      if (parent) {
        this.fuelReimbursementPolicy = parent.fuelReimbursementPolicy;
      }
    }
    next();
});
  
const Org = mongoose.model('Org', orgSchema);
module.exports = {
	Vehicle,
    Org
};

