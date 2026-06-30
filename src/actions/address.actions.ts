"use server";

import { auth } from "@/auth";
import { AddressService } from "@/services/address.service";
import { revalidatePath } from "next/cache";

export async function createAddressAction(data: {
  userId: string;
  label?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault?: boolean;
}): Promise<{ success: boolean; address?: object; error?: string }> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== data.userId) {
    return { success: false, error: "غير مصرح" };
  }
  const address = await AddressService.createAddress(data.userId, data);
  revalidatePath("/account/addresses");
  return { success: true, address };
}

export async function deleteAddressAction(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "غير مصرح" };
  await AddressService.deleteAddress(id, session.user.id);
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function setDefaultAddressAction(id: string): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "غير مصرح" };
  await AddressService.setDefault(id, session.user.id);
  revalidatePath("/account/addresses");
  return { success: true };
}
