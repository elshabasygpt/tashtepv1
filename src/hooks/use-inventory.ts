"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";

export function useInventory(productId: string, initialStock: number | null) {
  const [stock, setStock] = useState<number | null>(initialStock);

  useEffect(() => {
    // If we have a mock environment or missing keys, skip pusher setup
    const pusherClient = getPusherClient();
    if (!pusherClient) return;

    const channel = pusherClient.subscribe("inventory-channel");

    channel.bind("stock-update", (data: { productId: string; stock: number }) => {
      if (data.productId === productId) {
        setStock(data.stock);
      }
    });

    return () => {
      channel.unbind("stock-update");
      pusherClient.unsubscribe("inventory-channel");
    };
  }, [productId]);

  return { stock };
}
