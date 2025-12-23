import { PageHeader } from "@/components/PageHeader"
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAllCourses } from "@/features/admin/courses/hooks/useFetchAllCourses";
import { useFetchProductById } from "@/features/admin/products/hooks/useFetchProductById";
import { ProductForm } from "@/features/admin/products/ProductForm"
import { useParams } from "react-router";

const EditProduct = () => {
  const {productId} = useParams();

  if(!productId){
    return null;
  }
  const {data:courses, isFetching:isFetchingCourses} = useFetchAllCourses(); 
  const {data:product, isFetching: isFetchingProduct} = useFetchProductById(productId, {sendNestedCourse: false}); 

 
  if(!courses || !product){
    return null;
   }

   if(isFetchingCourses || isFetchingProduct){
    return <Skeleton className="w-full h-[500px]"/>
   }

  return (
    <div className="container my-6">
      <PageHeader title="Edit Product" />
      <ProductForm courses={courses} product={{...product, course_ids:product.courseProducts.map((cp)=> cp.course_id)}}/>
    </div>
  )
}
export default EditProduct