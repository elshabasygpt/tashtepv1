import { describe, it, expect, vi } from 'vitest';
import { ProductService } from './product.service';
import { prisma } from '@/lib/prisma';

// Mock the Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('ProductService', () => {
  it('should format products correctly with mapToUIProduct', () => {
    const mockPrismaProduct = {
      id: '1',
      name: 'Test Product',
      slug: 'test-product',
      description: 'A test product',
      price: 100,
      originalPrice: 150,
      stock: 10,
      isNew: true,
      isActive: true,
      rating: 4.5,
      reviewsCount: 10,
      categoryId: 'cat1',
      brandId: null,
      salePrice: null,
      saleEndAt: null,
      saleStartAt: null,
      lowStockThreshold: 5,
      b2bPrice: null,
      oemNumber: null,
      unitLabel: null,
      unitSize: null,
      deliveryDays: null,
      maxOrderQty: null,
      specs: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: 'cat1',
        name: 'Test Category',
        slug: 'test-category',
        description: null,
        image: null,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      images: [
        { id: 'img1', url: 'https://example.com/image.jpg', alt: 'Test', productId: '1', isMain: true }
      ]
    };

    const result = ProductService.mapToUIProduct(mockPrismaProduct);

    expect(result).toEqual({
      id: '1',
      name: 'Test Product',
      price: 100,
      originalPrice: 150,
      category: 'Test Category',
      image: 'https://example.com/image.jpg',
      rating: 4.5,
      reviewsCount: 10,
      isNew: true,
      description: 'A test product',
    });
  });

  it('should call prisma.findMany with correct pagination and order for getProducts', async () => {
    const mockData = [
      { id: '1', name: 'Product A', price: 100, isNew: true, rating: 5, reviewsCount: 0, categoryId: 'cat1', slug: 'a', stock: 10, createdAt: new Date(), updatedAt: new Date() }
    ];
    vi.mocked(prisma.product.findMany).mockResolvedValueOnce(mockData as unknown as never);

    const result = await ProductService.getProducts({ page: 2, limit: 10 });
    
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: expect.any(Object),
      take: 10,
      skip: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
      }
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});
