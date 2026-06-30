import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckoutService } from './checkout.service';
import { prisma } from '@/lib/prisma';
import { PaymobService } from '@/lib/paymob';

// Mock the Prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock Paymob Service
vi.mock('@/lib/paymob', () => ({
  PaymobService: {
    generateIframeUrl: vi.fn(),
  },
}));

describe('CheckoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw UnauthorizedError if neither userId nor guestEmail is provided', async () => {
    const request = {
      shippingDetails: { fullName: 'Test', phone: '123', address: '123 St', city: 'Cairo' },
      cartItems: [],
      paymentMethod: 'cod' as const,
    };
    await expect(CheckoutService.processCheckout(request)).rejects.toThrow('User must be logged in or provide an email to checkout.');
  });

  it('should throw DatabaseError if user email is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    const request = {
      userId: 'user1',
      shippingDetails: { fullName: 'Test', phone: '123', address: '123 St', city: 'Cairo' },
      cartItems: [],
      paymentMethod: 'cod' as const,
    };
    await expect(CheckoutService.processCheckout(request)).rejects.toThrow('Failed to process checkout transaction');
  });

  it('should process COD checkout successfully', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ email: 'test@example.com' } as unknown as never);
    vi.mocked(prisma.$transaction).mockResolvedValueOnce({ id: 'order1' } as unknown as never);

    const request = {
      userId: 'user1',
      shippingDetails: { fullName: 'Test', phone: '123', address: '123 St', city: 'Cairo' },
      cartItems: [{ productId: 'prod1', quantity: 1, price: 100 }],
      paymentMethod: 'cod' as const,
    };

    const result = await CheckoutService.processCheckout(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user1' }, select: { email: true } });
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.orderId).toBe('order1');
    expect(result.message).toContain('تم استلام طلبك بنجاح');
  });

  it('should process CARD checkout and return Paymob URL', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ email: 'real@example.com' } as unknown as never);
    vi.mocked(prisma.$transaction).mockResolvedValueOnce({ id: 'order2' } as unknown as never);
    vi.mocked(PaymobService.generateIframeUrl).mockResolvedValueOnce('https://paymob.com/iframe');

    const request = {
      userId: 'user2',
      shippingDetails: { fullName: 'Test Name', phone: '123', address: '123 St', city: 'Cairo' },
      cartItems: [{ productId: 'prod1', quantity: 1, price: 100 }],
      paymentMethod: 'card' as const,
    };

    const result = await CheckoutService.processCheckout(request);

    expect(PaymobService.generateIframeUrl).toHaveBeenCalledWith(
      150, // 100 subtotal + 50 shipping
      'order2',
      expect.objectContaining({ email: 'real@example.com' }) // Verified that real email is used
    );
    expect(result.success).toBe(true);
    expect(result.orderId).toBe('order2');
    expect(result.paymentUrl).toBe('https://paymob.com/iframe');
  });
});
