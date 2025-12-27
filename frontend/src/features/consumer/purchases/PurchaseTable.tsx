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

export default function PurchasesPage() {
  const { userId } =  useUser();

  const {data: purchases} = useFetchPurchases(userId ?? '');

  const queries = useFetchMultipleProducts(purchases ? purchases.map((p)=> p.product_id):[]);

  const productsDetailsArray = queries.map(query => query.data);

  if(!userId) return <Navigate to="/" />;


   if(!purchases){
    return <Skeleton className="w-full h-[500px]"/>
   }

  console.log({purchases,productsDetailsArray});

  const getProductDetail = (id: string)=>{
    if(!productsDetailsArray){
      return undefined;
    }

    return productsDetailsArray.find(pd => pd && pd.id === id);

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

  const getImg = (pId: string)=>{
    const productDetails = getProductDetail(pId);
    if(!productDetails) return null;
    return <img
      className="object-cover rounded size-12"
      src={productDetails.image_url}
      alt={productDetails.name}
      width={192}
      height={192}
    />
  }

  const getName = (pId: string)=>{
    const productDetails = getProductDetail(pId);
    if(!productDetails) return null;
    return productDetails.name;
  }

  const getCreatedAt = (pId: string)=>{
    const productDetails = getProductDetail(pId);
    if(!productDetails) return null;
    return formatDate(productDetails.created_at);
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
          {purchases.map(purchase => (
            <TableRow key={purchase.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  {getImg(purchase.product_id)}
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">
                      {getName(purchase.id)}
                    </div>
                    <div className="text-muted-foreground">
                      {getCreatedAt(purchase.id)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
