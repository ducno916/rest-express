const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCustomersWithOrders() {
  try {
    const customersWithOrders = await prisma.customers.findMany({
      include: {
        orders: true
      }
    });

    return customersWithOrders;
  } catch (error) {
    console.error('Error retrieving customers with orders:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

getCustomersWithOrders()
  .then((customers) => {
    const prettyCustomers = JSON.stringify(customers, null, 2);
    console.log('Customers with orders:', prettyCustomers);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
