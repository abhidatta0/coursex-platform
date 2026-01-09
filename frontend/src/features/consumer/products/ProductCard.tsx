import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@/features/admin/products/types"
import Price from "@/features/consumer/products/components/Price"
import { Link } from "react-router"

export function ProductCard({
  id,
  image_url,
  name,
  price_in_dollars,
  description,
}: Product) {
  return (
    <Card className="overflow-hidden flex flex-col w-full mx-auto">
      <div className="relative aspect-video w-full">
        <img src={image_url} alt={name} loading="lazy" className="object-cover" />
      </div>
      <CardHeader className="space-y-0">
        <CardDescription>
          <Price price={price_in_dollars} />
        </CardDescription>
        <CardTitle className="text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full text-md py-y" asChild>
          <Link to={`/products/${id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}