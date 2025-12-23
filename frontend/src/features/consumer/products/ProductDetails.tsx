import { Skeleton } from "@/components/ui/skeleton";
import { useFetchProductById } from "@/features/admin/products/hooks/useFetchProductById";
import Price from "@/features/consumer/products/components/Price";
import { useParams } from "react-router";

const ProductDetails = () => {

  const {id:productId} = useParams();
  if(!productId){
    return null;
  }

  const {data:product} = useFetchProductById(productId); 
  if(!product){
    return <Skeleton className="w-full h-[500px]"/>
  }
  
  return (
    <div className="container my-6">
      <div className="flex gap-16 items-center justify-between">
        <div className="flex gap-6 flex-col items-start">
          <div className="flex flex-col gap-2">
            <Price price={product.price_in_dollars} />
            <h1 className="text-4xl font-semibold">{product.name}</h1>
           
          </div>
          <div className="text-xl">{product.description}</div>
        </div>
        <div className="relative aspect-video max-w-lg grow">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-contain rounded-xl"
          />
        </div>
      </div>
      </div>  
    )
}
export default ProductDetails