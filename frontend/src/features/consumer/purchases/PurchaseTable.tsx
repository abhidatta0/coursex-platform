import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { useFetchPurchases } from "./hooks/useFetchPurchases"
import useUser from "@/features/auth/useUser"
import { Skeleton } from "@/components/ui/skeleton"
import { Link, Navigate } from "react-router"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useFetchMultipleProducts } from "./hooks/useFetchMultipleProducts"
import { ProductWithCourseData } from "@/features/admin/products/types"

export default function PurchasesPage() {
  const { userId } =  useUser();

  const {data: purchases} = useFetchPurchases(userId ?? '');

  const queries = useFetchMultipleProducts(purchases ? purchases.map((p)=> p.product_id):[]);

  if(!userId) return <Navigate to="/" />;


   if(!purchases){
    return <Skeleton className="w-full h-[500px]"/>
   }

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-start">
        You have made no purchases yet
        <Button asChild size="lg">
          <Link to="/">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  const productMap = new Map<string,{
    data:ProductWithCourseData|undefined, 
    isLoading: boolean,
    isError: boolean,
  }>();
  queries.forEach((query, index) => {
    const productId = purchases[index]?.product_id;
    if (productId) {
      productMap.set(productId, {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
      });
    }
  });

  const getImg = (productWithCourseData?: ProductWithCourseData)=>{
    if(!productWithCourseData) return null;
    return <img
      className="object-cover rounded size-12"
      src={productWithCourseData.image_url}
      alt={productWithCourseData.name}
      width={192}
      height={192}
    />
  }

  return (
    <div className="container my-6">
      <PageHeader title="Purchase History" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Product Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map(purchase => {
            const productDetail = productMap.get(purchase.product_id);
            if(!productDetail){
              return null;
            }
            const { data, isLoading, isError } = productDetail;

            return <TableRow key={purchase.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <Skeleton className="size-12 rounded" />
                  ) : isError ? (
                    <div className="size-12 rounded bg-gray-200 flex items-center justify-center text-xs">Error</div>
                  ) : (
                    getImg(data)
                  )}                 
                   <div className="flex flex-col gap-1">
                    <div className="font-semibold">
                      {isLoading ? (
                          <Skeleton className="h-4 w-32" />
                        ) : isError ? (
                          <span className="text-red-500 text-sm">Failed to load</span>
                        ) : (
                          data?.name || 'Unknown Product'
                        )}
                    </div>
                    <div className="text-muted-foreground">
                      Purchased on: {formatDate(new Date(purchase.created_at))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {purchase.refunded_at ? (
                  <Badge variant="outline">Refunded</Badge>
                ) : (
                  formatPrice(purchase.price_paid_in_cents / 100)
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" asChild>
                  <Link to={`/products/${purchase.product_id}`}>Details</Link>
                </Button>
              </TableCell>
            </TableRow>
           })}
        </TableBody>
      </Table>
    </div>
  )
}
