import { Course } from "../courses/types";

export const PRODUCT_STATUSES = ["public", "private"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export type ProductList = ({
  coursesCount: number;
  customersCount: number;
} & Product)[];

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  image_public_id: string;
  price_in_dollars: number;
  status: ProductStatus;
  created_at: Date;
}

export type CreateProductPayload = Omit<Product, "id" | "created_at"> & {
  course_ids: string[];
  author_ids: string[];
};

export type ProductWithCourseData = Product & {
  courseProducts: { course_id: string; course?: Course }[];
};
