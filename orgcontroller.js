const {Org} = require('./db');

exports.createOrg = async (req, res) => {
  try {
    const org = new Org(req.body);
    await org.save();
    res.status(201).json(org);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrg = async (req, res) => {
  const { id } = req.params;
  try {
    const org = await Org.findById(id);
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    Object.assign(org, req.body);

    if (req.body.fuelReimbursementPolicy && org.parentOrg) {
      const parent = await Org.findById(org.parentOrg);
      if (parent && parent.fuelReimbursementPolicy !== req.body.fuelReimbursementPolicy) {
        return res.status(400).json({ error: 'Child organization cannot override inherited fuel reimbursement policy' });
      }
    }

    await org.save();
    res.status(200).json(org);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllOrgs = async (req, res) => {
  try {
    const orgs = await Org.find().populate('parentOrg').populate('children');
    res.status(200).json(orgs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
