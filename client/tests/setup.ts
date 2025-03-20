// Import Prisma correctly - this should resolve for both ESM and CommonJS
import { PrismaClient } from '@prisma/client/index.js'; // Adjusted import for ESM compatibility
import { afterAll, beforeAll, beforeEach } from '@jest/globals';

// Set database URL explicitly if not already set
const DATABASE_URL = "postgresql://devclassmate:pass123@localhost:5432/classmate_test";

// Create a test client with explicit connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  log: ['error'],
});

// Setup before tests
beforeAll(async () => {
  console.log('Connecting to database:', DATABASE_URL);
  // Connect to the database
  await prisma.$connect();
});

// Clean up database between tests
beforeEach(async () => {
  console.log('Cleaning up database before test...');
  try {
    // Clean the database - order matters due to foreign key constraints
    await prisma.note.deleteMany({});
    await prisma.meeting.deleteMany({});
    await prisma.class.deleteMany({});
    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  }
});

// Clean up after tests
afterAll(async () => {
  console.log('Disconnecting from database...');
  // Final cleanup
  await prisma.note.deleteMany({});
  await prisma.meeting.deleteMany({});
  await prisma.class.deleteMany({});
  
  // Disconnect
  await prisma.$disconnect();
});

export { prisma }; 