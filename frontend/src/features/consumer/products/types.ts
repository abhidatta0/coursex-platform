export const PAYMENT_PROVIDERS = ["stripe", "razorpay"] as const;
export type PaymentProviders = (typeof PAYMENT_PROVIDERS)[number];

export type Purchase = {
  id: string,
  price_paid_in_cents: number,
  user_id: string,
  product_id: string,
  payment_method: PaymentProviders,
  payment_id: string,
  payment_status: "paid" | "initiated" | "failed",
  order_status: "confirmed" | "pending" | "failed"
}

export type CreatePurchasePayload = Omit<Purchase,'id'>;

export type CheckUserOwnProductPayload = {userId: string, productId: string};