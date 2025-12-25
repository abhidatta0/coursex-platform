import { PageHeader } from "@/components/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchProductById } from "@/features/admin/products/hooks/useFetchProductById"
import useUser from "@/features/auth/useUser"
import { SignIn } from "@clerk/react-router"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useParams } from "react-router"
import { PAYMENT_PROVIDERS, PaymentProviders } from "@/features/consumer/products/types"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PurchasePage() {
  const { id } = useParams();

  const {isLoggedIn} = useUser();
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviders>('stripe');
  if (!id) {
    return null;
  }

  const { data: product, isError } = useFetchProductById(id, {
    sendNestedCourse: false,
  });

  if (!product) return <Skeleton className="w-full h-[500px]"/>

  if(isError) return <p  className="container m-3">Invalid product</p>

  if(!isLoggedIn){
    return (
      <div className="container my-6 flex flex-col items-center">
        <PageHeader title="You need an account to make a purchase" />
        <SignIn forceRedirectUrl={`/products/${id}/purchase`}/>
      </div>
    );
  }

  const handlePurchase = ()=>{
    console.log({selectedProvider})
  }


  const getLogo = (provider: PaymentProviders)=>{
    if(provider === 'razorpay'){
      return '/assets/img/razorpay-icon.svg';
    }
    return '/assets/img/stripe.svg';
  }
  return (
    <div className="container my-6">
      <div className="mb-2">Checkout :<span className="text-xl underline">{product.name}</span> for ${product.price_in_dollars}</div>
      <div>
        <RadioGroup defaultValue={selectedProvider} onValueChange={(val:PaymentProviders)=>setSelectedProvider(val)}>
        {
          PAYMENT_PROVIDERS.map((p)=>(
            <div className="flex items-center space-x-2" key={p}>
              <RadioGroupItem value={p} id={p} />
              <Label htmlFor={p} className="capitalize">
                <img src={getLogo(p)} className="size-10 object-fill" />
                </Label>
            </div>
          ))
        }
        </RadioGroup>
      <Button onClick={handlePurchase} className="my-3">Proceed</Button>
      </div>
    </div>
  ); 
  
}
