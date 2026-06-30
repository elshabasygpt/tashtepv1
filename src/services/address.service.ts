import { prisma } from "@/lib/prisma";

export const AddressService = {
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  async createAddress(userId: string, data: {
    label?: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    isDefault?: boolean;
  }) {
    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma.address.create({ data: { userId, ...data } });
  },

  async updateAddress(id: string, userId: string, data: {
    label?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    isDefault?: boolean;
  }) {
    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma.address.update({ where: { id }, data });
  },

  async deleteAddress(id: string, userId: string) {
    return prisma.address.deleteMany({ where: { id, userId } });
  },

  async setDefault(id: string, userId: string) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return prisma.address.update({ where: { id }, data: { isDefault: true } });
  },
};
