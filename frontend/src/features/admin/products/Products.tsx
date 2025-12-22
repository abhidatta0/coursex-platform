import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/features/admin/products/ProductTable";
import { Link } from "react-router";

const Products = () => {
  return (
     <div className="container my-6">
      <PageHeader title="Products">
        <Button asChild>
          <Link to="new">New Product</Link>
        </Button>
      </PageHeader>
      <ProductTable />
    </div>
  )
}
export default Products;