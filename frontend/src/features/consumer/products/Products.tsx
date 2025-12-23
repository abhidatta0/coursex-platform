import { Skeleton } from "@/components/ui/skeleton";
import { useFetchPublicProducts } from "@/features/consumer/products/hooks/useFetchPublicProducts";
import { ProductCard } from "@/features/consumer/products/ProductCard";

const Products = () => {
  const {data:products, isFetching} = useFetchPublicProducts(); 

  
   if(!products){
    return null;
   }

   if(isFetching){
    return <Skeleton className="w-full h-[500px]"/>
   }
  return (
    <div className="container my-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}
export default Products