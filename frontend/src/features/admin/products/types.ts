export const PRODUCT_STATUSES = ["public", "private"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];


export type ProductList =  ({
    coursesCount: number;
    customersCount: number;
} & Product)[];

export type Product = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    image_public_id: string;
    price_in_dollars: number;
    status: ProductStatus;
}