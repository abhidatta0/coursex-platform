export const PAYMENT_PROVIDERS = ["stripe", "razorpay"] as const;
export type PaymentProviders = (typeof PAYMENT_PROVIDERS)[number];