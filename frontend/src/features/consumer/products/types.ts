export const PAYMENT_PROVIDERS = ["stripe", "razorpay"] as const;
export type PaymentProviders = (typeof PAYMENT_PROVIDERS)[number];

export interface Purchase {
  id: string;
  price_paid_in_cents: number;
  user_id: string;
  product_id: string;
  payment_method: PaymentProviders;
  payment_id: string;
  payment_status: "paid" | "initiated" | "failed";
  order_status: "confirmed" | "pending" | "failed";
  refunded_at: Date | null;
  created_at: Date;
}

export type CreatePurchasePayload = Omit<
  Purchase,
  "id" | "refunded_at" | "created_at"
>;

export interface CheckUserOwnProductPayload {
  userId: string;
  productId: string;
}
