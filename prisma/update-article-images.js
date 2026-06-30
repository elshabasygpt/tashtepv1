const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const IMAGES = [
  {
    slug: 'how-to-choose-paint-for-each-room',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'matte-vs-satin-vs-gloss-paint',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'how-to-calculate-paint-quantity',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'best-paint-brands-egypt-2026',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'wallpaper-vs-paint-which-is-better',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'home-decor-colors-2026',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'diy-painting-guide-step-by-step',
    image: 'https://images.unsplash.com/photo-1669226391598-a9a5e4a0a9cf?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'types-of-flooring-complete-guide',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'how-to-maintain-and-extend-paint-life',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&h=630&fit=crop',
  },
  {
    slug: 'luxury-finishing-materials-guide',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&h=630&fit=crop',
  },
];

async function main() {
  for (const { slug, image } of IMAGES) {
    await prisma.article.update({ where: { slug }, data: { image } });
    console.log(`✓ ${slug}`);
  }
  console.log('تم تحديث جميع الصور');
}

main().catch(console.error).finally(() => prisma.$disconnect());
