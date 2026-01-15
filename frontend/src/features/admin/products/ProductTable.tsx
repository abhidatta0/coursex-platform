import { ActionButton } from "@/components/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductStatus } from "./types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { EyeIcon, LockIcon, Trash2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAllProducts } from "@/features/admin/products/hooks/useFetchAllProducts";
import { formatPlural, formatPrice } from "@/lib/utils";
import { Link } from "react-router";
import { useDeleteProduct } from "@/features/admin/products/hooks/useDeleteProduct";

export function ProductTable() {
  const { data: products, isFetching } = useFetchAllProducts();

  const { mutate, isPending } = useDeleteProduct();
  const deleteProduct = (id: string) => {
    mutate(id);
  };

  if (!products) {
    return null;
  }

  if (isFetching) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  if (products.length === 0) {
    return <EmptyDemo />;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {formatPlural(products.length, {
              singular: "product",
              plural: "products",
            })}
          </TableHead>
          <TableHead>Customers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <img
                  className="object-cover rounded size-12"
                  src={product.image_url}
                  alt={product.name}
                  width={192}
                  height={192}
                />
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-muted-foreground">
                    {formatPlural(product.coursesCount, {
                      singular: "course",
                      plural: "courses",
                    })}{" "}
                    • {formatPrice(product.price_in_dollars)}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>{product.customersCount}</TableCell>
            <TableCell>
              <Badge className="inline-flex items-center gap-2">
                {getStatusIcon(product.status)} {product.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button asChild>
                  <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
                </Button>
                <ActionButton
                  isLoading={isPending}
                  variant="destructive"
                  requireAreYouSure
                  action={() => deleteProduct(product.id)}
                >
                  <Trash2Icon />
                  <span className="sr-only">Delete</span>
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getStatusIcon(status: ProductStatus) {
  const Icon = {
    public: EyeIcon,
    private: LockIcon,
  }[status];

  return <Icon className="size-4" />;
}

export function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {/* <IconFolderCode /> */}
          <img src="/assets/img/product.png" />
        </EmptyMedia>
        <EmptyTitle>No Products Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any products yet. Get started by creating
          your first product.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="new">New Product</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
