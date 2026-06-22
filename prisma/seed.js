const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'دهانات داخلية', slug: 'interior-paints', description: 'أرقى أنواع الدهانات الداخلية بألوان عصرية تدوم طويلاً.' },
  { name: 'دهانات خارجية', slug: 'exterior-paints', description: 'دهانات خارجية مقاومة للعوامل الجوية تمنح واجهتك مظهراً فخماً.' },
  { name: 'أرضيات', slug: 'flooring', description: 'تشكيلة واسعة من البورسلين، السيراميك، والباركيه الفاخر.' },
  { name: 'ورق حائط', slug: 'wallpapers', description: 'تصاميم ورق حائط عصرية وكلاسيكية تناسب جميع الأذواق.' },
  { name: 'إضاءة', slug: 'lighting', description: 'حلول إضاءة متكاملة من ثريات حديثة وسبوت لايت.' },
  { name: 'ديكورات', slug: 'decorations', description: 'لمسات ديكورية فريدة من لوحات وتحف فنية.' },
  { name: 'أدوات', slug: 'tools', description: 'كافة أدوات التشطيب والبناء للمحترفين.' }
];

const PRODUCT_PREFIXES = ['جوتن', 'سايبس', 'سكيب', 'كليوباترا', 'الجوهرة', 'مظلوم', 'فينوماستيك', 'رويال'];
const PRODUCT_SUFFIXES = ['فاخر', 'مطفي', 'لامع', 'نصف لمعة', 'مقاوم للماء', 'إيطالي', 'إسباني', 'عالي الجودة'];

function generateProducts(categories) {
  const products = [];
  for (let i = 1; i <= 50; i++) {
    const category = categories[i % categories.length];
    const prefix = PRODUCT_PREFIXES[Math.floor(Math.random() * PRODUCT_PREFIXES.length)];
    const suffix = PRODUCT_SUFFIXES[Math.floor(Math.random() * PRODUCT_SUFFIXES.length)];
    const name = `${prefix} ${category.name} ${suffix} - موديل ${i}`;
    
    products.push({
      name,
      slug: `product-${i}-${Date.now()}`,
      description: `اكتشف الجودة مع ${name}. مصمم خصيصاً لتلبية احتياجات التشطيب الفاخر. يتميز بمتانة عالية وعمر افتراضي طويل مع سهولة في الاستخدام والتركيب.`,
      price: Math.floor(Math.random() * 1000) + 100,
      originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 500) + 1200 : null,
      stock: Math.floor(Math.random() * 100) + 10,
      isNew: Math.random() > 0.7,
      rating: (Math.random() * 2 + 3).toFixed(1) * 1, // 3.0 to 5.0
      reviewsCount: Math.floor(Math.random() * 50),
      categoryId: category.id,
    });
  }
  return products;
}

async function main() {
  console.log('Starting seed...');

  // 1. Wipe DB (order matters due to foreign keys)
  console.log('Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@tashtep.com', passwordHash, role: 'ADMIN' }
  });
  const trade = await prisma.user.create({
    data: { name: 'Trade Customer', email: 'trade@tashtep.com', passwordHash, role: 'TRADE' }
  });
  const customer = await prisma.user.create({
    data: { name: 'Normal Customer', email: 'customer@tashtep.com', passwordHash, role: 'CUSTOMER' }
  });

  // 3. Create Categories
  console.log('Creating categories...');
  const createdCategories = [];
  for (const cat of CATEGORIES) {
    const created = await prisma.category.create({ data: cat });
    createdCategories.push(created);
  }

  // 4. Create Products & Images
  console.log('Creating 50 products...');
  const productData = generateProducts(createdCategories);
  const createdProducts = [];
  
  for (const pData of productData) {
    const product = await prisma.product.create({
      data: {
        ...pData,
        images: {
          create: [
            { url: `https://placehold.co/600x600/png?text=${encodeURIComponent(pData.name)}`, alt: pData.name, isMain: true },
            { url: `https://placehold.co/600x600/png?text=Side+View`, alt: 'Side View', isMain: false },
            { url: `https://placehold.co/600x600/png?text=Details`, alt: 'Details', isMain: false }
          ]
        }
      }
    });
    createdProducts.push(product);
  }

  // 5. Create Reviews
  console.log('Creating reviews...');
  for (let i = 0; i < 20; i++) {
    await prisma.review.create({
      data: {
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
        comment: 'منتج ممتاز جداً وأنصح به بشدة!',
        userId: customer.id,
        productId: createdProducts[i].id
      }
    });
  }

  // 6. Create Orders
  console.log('Creating orders...');
  const statuses = ['PENDING', 'DELIVERED', 'CANCELLED'];
  for (let i = 0; i < 5; i++) {
    const p1 = createdProducts[Math.floor(Math.random() * 50)];
    const p2 = createdProducts[Math.floor(Math.random() * 50)];
    
    await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: p1.price + (p2.price * 2),
        status: statuses[i % statuses.length],
        shippingName: 'محمد أحمد',
        shippingPhone: '01001234567',
        shippingAddress: 'شارع التسعين، التجمع الخامس',
        shippingCity: 'القاهرة',
        items: {
          create: [
            { productId: p1.id, quantity: 1, price: p1.price },
            { productId: p2.id, quantity: 2, price: p2.price }
          ]
        }
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
