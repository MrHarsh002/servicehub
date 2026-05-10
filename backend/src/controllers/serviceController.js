const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category });
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ service });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// Create service (admin only)
exports.createService = async (req, res) => {
  try {
    const { name, description, category, basePrice, estimatedDuration } = req.body;

    const service = new Service({
      name,
      description,
      category,
      basePrice,
      estimatedDuration
    });

    await service.save();
    res.status(201).json({ message: 'Service created', service });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};
