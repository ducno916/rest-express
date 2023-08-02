const express = require('express');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Initialize the PrismaClient object for database querying
const prisma = new PrismaClient();

// Initialize the Express application
const app = express();
dotenv.config();

// Middleware to allow the application to parse JSON in requests
app.use(express.json());

// Set the JSON pretty-printing options to indent JSON with 2 spaces
app.set('json spaces', 2);

// Create an API route to return customer information along with their orders based on the customerNumber
app.get('/api/customers/:customerNumber', async (req, res) => {
  try {
    // Get the customerNumber from the URL parameter of the request
    const { customerNumber } = req.params;

    // Query the database to fetch customer information along with their orders
    const customerWithOrders = await prisma.customers.findUnique({
      where: { customerNumber: parseInt(customerNumber) },
      include: {
        orders: true
      }
    });

    // Check if the customer exists
    if (!customerWithOrders) {
      // If not found, return a 404 error
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Return the customer information along with their orders as JSON response
    res.json(customerWithOrders);
  } catch (error) {
    console.error('Error retrieving customer data:', error);
    // If there's an error during the query, return a 500 error
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Port on which the Express application listens
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  🚀 Server ready at: http://localhost:${PORT}
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`);
});