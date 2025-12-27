import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { useFetchPurchases } from "./hooks/useFetchPurchases"
import useUser from "@/features/auth/useUser"
import { Skeleton } from "@/components/ui/skeleton"
import { Link, Navigate } from "react-router"

export default function PurchasesPage() {
  const { userId } =  useUser();

  const {data: purchases} = useFetchPurchases(userId ?? '');
  if(!userId) return <Navigate to="/" />;


   if(!purchases){
    return <Skeleton className="w-full h-[500px]"/>
   }

   console.log({purchases});

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

  return (
    <div className="container my-6">
      <PageHeader title="Purchase History" />
    </div>
  )
}
