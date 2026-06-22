import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const hmac = searchParams.get("hmac");
    
    // In Paymob, the actual callback data comes as JSON body
    const body = await req.json();

    // Verify HMAC if you have the secret (assuming PAYMOB_HMAC_SECRET in env)
    // The HMAC is calculated using the concatenated values of specific fields.
    // For now, if no HMAC secret exists, we'll process the data, but log a warning.
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    
    if (hmacSecret && hmac) {
      const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order,
        owner,
        pending,
        source_data,
        success
      } = body.obj;

      const concatenatedString = [
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order.id,
        owner,
        pending,
        source_data.pan,
        source_data.sub_type,
        source_data.type,
        success,
      ].join("");

      const calculatedHmac = crypto
        .createHmac("sha512", hmacSecret)
        .update(concatenatedString)
        .digest("hex");

      if (calculatedHmac !== hmac) {
        console.error("HMAC validation failed");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else {
      console.warn("Paymob webhook received without HMAC validation due to missing secret");
    }

    // Process the payment
    const { success, pending, order: paymobOrder } = body.obj;
    const merchantOrderId = paymobOrder.merchant_order_id; // This is our DB Order ID

    if (merchantOrderId) {
      if (success && !pending) {
        await OrderService.updatePaymentStatus(merchantOrderId, "PAID");
      } else if (!success && !pending) {
        await OrderService.updatePaymentStatus(merchantOrderId, "FAILED");
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Paymob Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
