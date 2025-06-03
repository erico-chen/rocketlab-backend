import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Electron Rocket Model',
        price: 299.99,
        description: 'Scale model of Rocket Lab\'s Electron rocket, perfect for collectors and space enthusiasts.',
        brand: 'Rocket Lab',
        weight: 2.5,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mission Control Hoodie',
        price: 89.99,
        description: 'Premium quality hoodie with Rocket Lab mission control design.',
        brand: 'Rocket Lab Apparel',
        weight: 0.8,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Space Force Backpack',
        price: 129.99,
        description: 'Durable aerospace-grade material backpack with multiple compartments.',
        brand: 'Rocket Lab Gear',
        weight: 1.2,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Launch Vehicle Blueprint Poster',
        price: 24.99,
        description: 'Technical blueprint poster of Rocket Lab\'s launch vehicles.',
        brand: 'Rocket Lab Art',
        weight: 0.3,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Satellite Mini Model',
        price: 159.99,
        description: 'Detailed miniature model of a communication satellite.',
        brand: 'Rocket Lab',
        weight: 1.0,
      },
    }),
  ]);

  // Create a sample cart with items
  const cart = await prisma.cart.create({
    data: {
      status: 'active',
      items: {
        create: [
          {
            quantity: 1,
            productId: products[0].id, // Electron Rocket Model
          },
          {
            quantity: 2,
            productId: products[1].id, // Mission Control Hoodie
          },
        ],
      },
    },
  });

  // Create a sample completed order
  await prisma.order.create({
    data: {
      status: 'completed',
      total: 449.97, // 1 satellite model + 2 posters
      items: {
        create: [
          {
            quantity: 1,
            price: products[4].price,
            productId: products[4].id, // Satellite Mini Model
          },
          {
            quantity: 2,
            price: products[3].price,
            productId: products[3].id, // Launch Vehicle Blueprint Poster
          },
        ],
      },
    },
  });

  console.log('Database has been seeded! 🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 