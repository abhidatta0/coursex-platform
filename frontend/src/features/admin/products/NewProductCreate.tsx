import { PageHeader } from "@/components/PageHeader"
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAllCourses } from "@/features/admin/courses/hooks/useFetchAllCourses";
import { ProductForm } from "@/features/admin/products/ProductForm"

const NewProductCreate = () => {
  const {data:courses, isFetching} = useFetchAllCourses(); 
 
  if(!courses){
    return null;
   }

   if(isFetching){
    return <Skeleton className="w-full h-[500px]"/>
   }
  return (
    <div className="container my-6">
        <PageHeader title="New Product"/>
        <ProductForm courses={courses}/>
    </div>
  )
}
export default NewProductCreate