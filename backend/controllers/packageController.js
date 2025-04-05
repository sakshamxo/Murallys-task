// travel-booking-app/backend/controllers/packageController.js
import TravelPackage from '../models/Package.js';

// 📌 Create a new travel package (Agents only)
export const createPackage = async (req, res) => {
  if (req.user.role !== 'agent') return res.status(403).json({ message: 'Access denied' });

  try {
    const { destination, price, description, city } = req.body;
    const newPackage = new TravelPackage({
      destination,
      price,
      description,
      agentId: req.user._id,
      city,
    });

    await newPackage.save();

    req.app.get('io').emit('packageAdded', newPackage);

    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// 📌 Get all travel packages
export const getAllPackages = async (req, res) => {
  try {
    const userCity = req.user.city;
    const packages = await TravelPackage.find({ city: userCity }).select('-agentId');
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 Delete a travel package (Agents only)
export const deletePackage = async (req, res) => {
  if (req.user.role !== 'agent') return res.status(403).json({ message: 'Access denied' });

  try {
    await TravelPackage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
