const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Categories:', await prisma.category.count());
  console.log('Products:', await prisma.product.count());
  console.log('Images:', await prisma.productImage.count());
  console.log('Users:', await prisma.user.count());
  console.log('Orders:', await prisma.order.count());
  console.log('Reviews:', await prisma.review.count());
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
