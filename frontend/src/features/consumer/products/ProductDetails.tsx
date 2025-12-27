import { Card, CardHeader,CardContent,CardDescription,CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionWithLesson } from "@/features/admin/courses/types";
import { useFetchProductById } from "@/features/admin/products/hooks/useFetchProductById";
import Price from "@/features/consumer/products/components/Price";
import { formatPlural } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link, useParams } from "react-router";
import { VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUser from "@/features/auth/useUser";
import { userOwnsProduct } from "./api";
import { useEffect, useState } from "react";

const getLessonCount = (sections:SectionWithLesson[])=>{
  let lessonCount = 0;
  for(const section of sections){
    lessonCount += section.lessons.length;
  }
  return lessonCount;
}

const ProductDetails = () => {

  const {id:productId} = useParams();

  const {data:product} = useFetchProductById(productId ?? '',{sendNestedCourse: true}); 

  if(!productId){
    return null;
  }

  if(!product){
    return <Skeleton className="w-full h-[500px]"/>
  }

  const courseCount = product.courseProducts.length;

  let lessonCount = 0;
  for(const cp of product.courseProducts){
    if(cp.course){
      lessonCount += getLessonCount(cp.course.courseSections);
      
    }
  }
  
  return (
    <div className="container my-6">
      <div className="flex gap-16 items-center justify-between">
        <div className="flex gap-6 flex-col items-start">
          <div className="flex flex-col gap-2">
            <Price price={product.price_in_dollars} />
            <h1 className="text-4xl font-semibold">{product.name}</h1>
            <div className="text-muted-foreground">
              {formatPlural(courseCount, {
                singular: "course",
                plural: "courses",
              })}{" "}
              •{" "}
              {formatPlural(lessonCount, {
                singular: "lesson",
                plural: "lessons",
              })}
            </div>
          </div>
          <div className="text-xl">{product.description}</div>
          <PurchaseButton productId={product.id} />
        </div>
        <div className="relative aspect-video max-w-xs grow">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-contain rounded-xl"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 mt-8 items-start">
        {product.courseProducts.map(cp =>{
          if(!cp.course){
            return null;
          }
          return (
          <Card key={cp.course.id}>
            <CardHeader>
              <CardTitle>{cp.course.name}</CardTitle>
              <CardDescription>
                {formatPlural(cp.course.courseSections.length, {
                  plural: "sections",
                  singular: "section",
                })}{" "}
                •{" "}
                {formatPlural(
                  getLessonCount(cp.course.courseSections),
                  {
                    plural: "lessons",
                    singular: "lesson",
                  }
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple">
                {cp.course.courseSections.map(section => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="flex gap-2">
                      <div className="flex flex-col grow">
                        <span className="text-lg">{section.name}</span>
                        <span className="text-muted-foreground">
                          {formatPlural(section.lessons.length, {
                            plural: "lessons",
                            singular: "lesson",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                      {section.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 text-base"
                        >
                          <VideoIcon className="size-4" />
                          {lesson.status === "preview" ? (
                            <Link
                              to={`/courses/${cp.course_id}/lessons/${lesson.id}`}
                              className="underline text-accent"
                            >
                              {lesson.name}
                            </Link>
                          ) : (
                            lesson.name
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>)})}
        </div>
      </div>  
    )
}
export default ProductDetails

function PurchaseButton({ productId }: { productId: string }) {
  const { userId } =  useUser()
  const [alreadyOwnsProduct, setAlreadyOwnsProduct] = useState(false);

  useEffect(()=>{
    const checkIfUserOwns= async ()=>{
      const userOwns = !!userId && await userOwnsProduct({ userId, productId });
      setAlreadyOwnsProduct(userOwns);
    }
    checkIfUserOwns();
  },[productId, userId])

  if (alreadyOwnsProduct) {
    return <p>You already own this product.
      <Link to="/courses" className="underline"> Go to Courses</Link>
    </p>
  } else {
    return (
      <Button className="text-xl h-auto py-4 px-8 rounded-lg" asChild>
        <Link to={`/products/${productId}/purchase`}>Get Now</Link>
      </Button>
    )
  }
}