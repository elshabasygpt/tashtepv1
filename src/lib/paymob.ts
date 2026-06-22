export interface BillingData {
  apartment: string;
  email: string;
  floor: string;
  first_name: string;
  street: string;
  building: string;
  phone_number: string;
  shipping_method: string;
  postal_code: string;
  city: string;
  country: string;
  last_name: string;
  state: string;
}

export const PaymobService = {
  async authenticate(): Promise<string> {
    const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });

    if (!response.ok) throw new Error("Paymob authentication failed");
    const data = await response.json();
    return data.token;
  },

  async registerOrder(token: string, amountCents: number, merchantOrderId: string): Promise<string> {
    const response = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: "false",
        amount_cents: amountCents,
        currency: "EGP",
        merchant_order_id: merchantOrderId,
      }),
    });

    if (!response.ok) throw new Error("Paymob order registration failed");
    const data = await response.json();
    return data.id.toString();
  },

  async getPaymentKey(token: string, amountCents: number, orderId: string, billingData: BillingData): Promise<string> {
    const response = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
      }),
    });

    if (!response.ok) throw new Error("Paymob payment key generation failed");
    const data = await response.json();
    return data.token;
  },

  async generateIframeUrl(amount: number, orderId: string, billingData: BillingData): Promise<string> {
    try {
      if (!process.env.PAYMOB_API_KEY) {
        // Fallback for development if env vars are missing
        console.warn("PAYMOB_API_KEY is missing. Using mock payment URL.");
        return `https://accept.paymob.com/api/acceptance/iframes/mock?order=${orderId}`;
      }

      const amountCents = Math.round(amount * 100);
      const token = await this.authenticate();
      const paymobOrderId = await this.registerOrder(token, amountCents, orderId);
      const paymentKey = await this.getPaymentKey(token, amountCents, paymobOrderId, billingData);
      
      return `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    } catch (error) {
      console.error("Paymob Error:", error);
      throw new Error("Failed to initialize payment gateway");
    }
  }
};
