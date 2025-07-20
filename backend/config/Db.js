const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();  // Instantiate client

module.exports = prisma;            // Export instance
