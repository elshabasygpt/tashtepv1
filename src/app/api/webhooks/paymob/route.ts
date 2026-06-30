import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import crypto from "crypto";
import { logger } from "@/lib/logger";

async function updateWithRetry(
  orderId: string,
  status: "PAID" | "FAILED",
  attempts = 3
): Promise<void> {
  for (let i = 1; i <= attempts; i++) {
    try {
      await OrderService.updatePaymentStatus(orderId, status);
      return;
    } catch (err) {
      logger.error({ err, orderId, status, attempt: i }, "updatePaymentStatus failed");
      if (i === attempts) throw err;
      await new Promise(r => setTimeout(r, i * 500));
    }
  }
}

export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const hmac = searchParams.get("hmac");
    const body = await req.json();

    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

    if (hmacSecret) {
      if (!hmac) {
        logger.error("Paymob webhook missing HMAC parameter");
        return NextResponse.json({ error: "Missing HMAC" }, { status: 400 });
      }

      const obj = body.obj;
      const concatenated = [
        obj.amount_cents, obj.created_at, obj.currency, obj.error_occured,
        obj.has_parent_transaction, obj.id, obj.integration_id, obj.is_3d_secure,
        obj.is_auth, obj.is_capture, obj.is_refunded, obj.is_standalone_payment,
        obj.is_voided, obj.order?.id, obj.owner, obj.pending,
        obj.source_data?.pan, obj.source_data?.sub_type, obj.source_data?.type,
        obj.success,
      ].join("");

      const calculated = crypto
        .createHmac("sha512", hmacSecret)
        .update(concatenated)
        .digest("hex");

      if (calculated !== hmac) {
        logger.error({ hmac, calculated }, "Paymob HMAC mismatch");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      logger.error("PAYMOB_HMAC_SECRET not configured — rejecting webhook");
      return NextResponse.json({ error: "Webhook authentication not configured" }, { status: 400 });
    }

    const { success, pending, order: paymobOrder } = body.obj ?? {};
    const merchantOrderId: string | undefined = paymobOrder?.merchant_order_id;

    if (!merchantOrderId) {
      logger.warn({ body }, "Paymob webhook missing merchant_order_id");
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (success && !pending) {
      await updateWithRetry(merchantOrderId, "PAID");
      logger.info({ orderId: merchantOrderId }, "Payment marked PAID");
    } else if (!success && !pending) {
      await updateWithRetry(merchantOrderId, "FAILED");
      logger.info({ orderId: merchantOrderId }, "Payment marked FAILED");
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    logger.error({ error }, "Paymob webhook unhandled error");
    // Return 200 so Paymob doesn't keep retrying on our own DB errors
    return NextResponse.json({ error: "Internal error — logged" }, { status: 200 });
  }
}
