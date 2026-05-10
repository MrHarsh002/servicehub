require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./src/models/Service');

const seedServices = [
  {
    name: 'Plumbing Repair',
    description: 'Professional plumbing repair and installation services',
    category: 'Plumbing',
    basePrice: 500,
    estimatedDuration: '1-2 hours',
    image: null
  },
  {
    name: 'Electrical Wiring',
    description: 'Licensed electrical installation and repair services',
    category: 'Electrical',
    basePrice: 800,
    estimatedDuration: '2-3 hours',
    image: null
  },
  {
    name: 'Home Cleaning',
    description: 'Thorough house cleaning and deep cleaning services',
    category: 'Cleaning',
    basePrice: 400,
    estimatedDuration: '2-3 hours',
    image: null
  },
  {
    name: 'Carpentry Work',
    description: 'Wooden furniture and carpentry services',
    category: 'Carpentry',
    basePrice: 1000,
    estimatedDuration: '3-4 hours',
    image: null
  },
  {
    name: 'Wall Painting',
    description: 'Professional interior and exterior painting',
    category: 'Painting',
    basePrice: 600,
    estimatedDuration: '2-3 hours',
    image: null
  },
  {
    name: 'AC Repair',
    description: 'Air conditioning repair and servicing',
    category: 'Other',
    basePrice: 700,
    estimatedDuration: '1-2 hours',
    image: null
  }
];

async function runSeed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    let inserted = 0;
    let updated = 0;

    for (const service of seedServices) {
      const existing = await Service.findOne({
        name: service.name,
        category: service.category
      });

      if (existing) {
        existing.description = service.description;
        existing.basePrice = service.basePrice;
        existing.estimatedDuration = service.estimatedDuration;
        existing.image = service.image;
        await existing.save();
        updated += 1;
      } else {
        await Service.create(service);
        inserted += 1;
      }
    }

    console.log(`Seeding complete. Inserted: ${inserted}, Updated: ${updated}`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

runSeed();
