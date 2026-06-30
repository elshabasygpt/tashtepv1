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

const PAINT_CATEGORY_SLUGS = ['interior-paints', 'exterior-paints'];

const PAINT_COLORS = [
  { label: 'أبيض كلاسيكي', value: '#FFFFFF' },
  { label: 'بيج رملي', value: '#E5E0D8' },
  { label: 'رمادي فاتح', value: '#D1D5D8' },
  { label: 'أزرق سلت', value: '#8C929D' },
];

const PAINT_SIZES = [
  { label: '1 لتر', value: '1L' },
  { label: '3 لتر', value: '3L' },
  { label: '9 لتر', value: '9L' },
];

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
      isPaint: PAINT_CATEGORY_SLUGS.includes(category.slug),
    });
  }
  return products;
}

const GOVERNORATES = [
  { name: 'القاهرة',           shippingCost: 30 },
  { name: 'الجيزة',            shippingCost: 30 },
  { name: 'القليوبية',          shippingCost: 35 },
  { name: 'الإسكندرية',        shippingCost: 40 },
  { name: 'الشرقية',           shippingCost: 45 },
  { name: 'الدقهلية',          shippingCost: 45 },
  { name: 'البحيرة',           shippingCost: 45 },
  { name: 'الغربية',           shippingCost: 45 },
  { name: 'المنوفية',          shippingCost: 45 },
  { name: 'كفر الشيخ',         shippingCost: 50 },
  { name: 'دمياط',             shippingCost: 50 },
  { name: 'بورسعيد',           shippingCost: 55 },
  { name: 'الإسماعيلية',       shippingCost: 50 },
  { name: 'السويس',            shippingCost: 55 },
  { name: 'الفيوم',            shippingCost: 50 },
  { name: 'بني سويف',          shippingCost: 55 },
  { name: 'المنيا',            shippingCost: 60 },
  { name: 'أسيوط',             shippingCost: 65 },
  { name: 'سوهاج',             shippingCost: 65 },
  { name: 'قنا',               shippingCost: 70 },
  { name: 'الأقصر',            shippingCost: 75 },
  { name: 'أسوان',             shippingCost: 80 },
  { name: 'البحر الأحمر',      shippingCost: 85 },
  { name: 'سيناء الشمالية',    shippingCost: 80 },
  { name: 'سيناء الجنوبية',    shippingCost: 85 },
  { name: 'مطروح',             shippingCost: 80 },
  { name: 'الوادي الجديد',     shippingCost: 90 },
];

const BRANDS = [
  { name: 'جوتن',         slug: 'jotun',          description: 'علامة نرويجية عالمية رائدة في الدهانات والطلاءات عالية الجودة.' },
  { name: 'سايبس',        slug: 'sipes',          description: 'منتجات كيماوية للبناء والتشطيب بمعايير أوروبية.' },
  { name: 'فينوماستيك',   slug: 'finomastico',    description: 'دهانات فاخرة بتقنيات إيطالية لتشطيبات داخلية راقية.' },
  { name: 'كليوباترا',    slug: 'cleopatra',      description: 'علامة مصرية أصيلة بجودة عالمية في السيراميك والبورسلين.' },
  { name: 'الجوهرة',      slug: 'elgohara',       description: 'منتجات تشطيب مصرية بخامات ممتازة وأسعار تنافسية.' },
  { name: 'رويال',        slug: 'royal',          description: 'طلاءات ملكية الجودة للأسطح الداخلية والخارجية.' },
  { name: 'سكيب',         slug: 'skip',           description: 'حلول تشطيب متكاملة مع ضمان طويل الأمد.' },
  { name: 'مظلوم',        slug: 'mazloum',        description: 'علامة مصرية عريقة في مواد البناء والتشطيب.' },
];

const DEFAULT_GENERAL_SETTINGS = {
  storeName: 'تشطيب',
  storeDescription: 'الوجهة الأولى والموثوقة لكل من يبحث عن التميز والرقي في تشطيب المساحات، مع خيارات واسعة من أرقى الخامات.',
  phone: '+20 100 000 0000',
  email: 'info@tashtep.com',
  address: 'القاهرة، مصر - التجمع الخامس، شارع التسعين',
  facebookUrl: 'https://facebook.com/tashtep',
  instagramUrl: 'https://instagram.com/tashtep',
  twitterUrl: 'https://twitter.com/tashtep',
  whatsappEnabled: true,
  whatsappNumber: '201000000000',
  whatsappMessage: 'مرحباً فريق تشطيب، أحتاج إلى مساعدة.',
};

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
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.governorate.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.verificationToken.deleteMany();
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
    const { isPaint, ...productFields } = pData;
    const product = await prisma.product.create({
      data: {
        ...productFields,
        images: {
          create: [
            { url: `https://picsum.photos/seed/${pData.slug}/600/750`, alt: pData.name, isMain: true },
            { url: `https://picsum.photos/seed/${pData.slug}-2/600/750`, alt: 'Side View', isMain: false },
            { url: `https://picsum.photos/seed/${pData.slug}-3/600/750`, alt: 'Details', isMain: false }
          ]
        },
        variants: isPaint ? {
          create: [
            ...PAINT_COLORS.map((c, idx) => ({ type: 'COLOR', label: c.label, value: c.value, order: idx })),
            ...PAINT_SIZES.map((s, idx) => ({ type: 'SIZE', label: s.label, value: s.value, order: idx })),
          ]
        } : undefined,
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

  // 7. Seed governorates
  console.log('Creating governorates...');
  for (const gov of GOVERNORATES) {
    await prisma.governorate.create({ data: { ...gov, isActive: true } });
  }

  // 8. Seed brands
  console.log('Creating brands...');
  for (const brand of BRANDS) {
    await prisma.brand.create({ data: brand });
  }

  // 9. Seed system settings
  console.log('Creating system settings...');
  await prisma.systemSetting.upsert({
    where: { key: 'site_general_settings' },
    update: { value: JSON.stringify(DEFAULT_GENERAL_SETTINGS) },
    create: { key: 'site_general_settings', value: JSON.stringify(DEFAULT_GENERAL_SETTINGS) },
  });

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
