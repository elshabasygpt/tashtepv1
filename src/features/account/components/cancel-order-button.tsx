"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Ban, Loader2 } from "lucide-react";
import { cancelOrderAction } from "@/actions/order.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CancelOrderButtonProps {
  orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!window.confirm("هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }

    startTransition(async () => {
      const result = await cancelOrderAction({ orderId });
      
      if (result?.success) {
        toast.success("تم إلغاء الطلب بنجاح");
        router.refresh();
      } else if (result?.error) {
        toast.error(result.error);
      } else {
        toast.error("حدث خطأ غير متوقع أثناء إلغاء الطلب");
      }
    });
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleCancel}
      disabled={isPending}
      className="flex items-center gap-2 h-8"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
      إلغاء الطلب
    </Button>
  );
}
