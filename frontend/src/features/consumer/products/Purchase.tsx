import { PageHeader } from "@/components/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchProductById } from "@/features/admin/products/hooks/useFetchProductById"
import useUser from "@/features/auth/useUser"
import { SignIn } from "@clerk/react-router"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Navigate, useParams } from "react-router"
import { CreatePurchasePayload, PAYMENT_PROVIDERS, PaymentProviders } from "@/features/consumer/products/types"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { completePurchaseService, userOwnsProduct } from "./api"
import { Spinner } from "@/components/ui/spinner"

// Generate a random payment ID
function generatePaymentId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PAY_${timestamp}_${random}`;
}

const defaultProvider = 'stripe';
export default function PurchasePage() {
  const { id } = useParams();

  const {isLoggedIn, userId} = useUser();
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviders>(defaultProvider);
  const [isPaying, setIsPaying] = useState(false);
  const [alreadyOwnsProduct, setAlreadyOwnsProduct] = useState(false);

  const { data: product, isError } = useFetchProductById(id ?? '', {
    sendNestedCourse: false,
  });

  useEffect(()=>{
    const orderId = sessionStorage.getItem("currentPaymentProvider") as PaymentProviders;
    setSelectedProvider(orderId ?? defaultProvider);
  },[])


  useEffect(()=>{
    if(id){
      const checkIfUserOwns= async ()=>{
        const userOwns = !!userId && await userOwnsProduct({ userId, productId:id });
        setAlreadyOwnsProduct(userOwns);
      }
      checkIfUserOwns();
    }
  },[id, userId])

  if (!id) {
    return null;
  }

  
  if (!product) return <Skeleton className="w-full h-[500px]"/>

  if(isError) return <p  className="container m-3">Invalid product</p>

  if(alreadyOwnsProduct){
    return <Navigate to="/courses" />
  }

  if(!isLoggedIn){
    return (
      <div className="container my-6 flex flex-col items-center">
        <PageHeader title="You need an account to make a purchase" />
        <SignIn forceRedirectUrl={`/products/${id}/purchase`}/>
      </div>
    );
  }

  const handlePurchase = async ()=>{
    console.log({selectedProvider})
    const payload:CreatePurchasePayload = {
      user_id:userId,
      payment_method:selectedProvider, // dummy payment !
      payment_id:'',
      price_paid_in_cents:product.price_in_dollars*100,
      product_id: product.id,
      payment_status: 'initiated',
      order_status: 'pending'
    };

    setIsPaying(true);
    try{
      /* Here, I am making a dummy payment call.
      I call razorpay api internally via server and server will redirect to razoprpay page,
      once successfully I will be redirected to /payment-return which will further complete the course buy
      */
      const data = await completePurchaseService(payload);
      console.log("order success",data);
      sessionStorage.setItem('currentOrderId',JSON.stringify(data.orderId));
      sessionStorage.setItem('currentPaymentProvider',selectedProvider);
      const paymentId=generatePaymentId();

      // redirect
      const url = new URL(`${window.origin}/payment-return`);
      url.searchParams.append('paymentId', paymentId);
      window.location.href = url.toString();
      setIsPaying(false);
    }catch(e){
      console.error(e);
    }finally{
      setIsPaying(false);
    }

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
      <Button onClick={handlePurchase} className="my-3"
      disabled={isPaying}
      >
      {isPaying && <Spinner />}
      Proceed</Button>
      </div>
    </div>
  ); 
  
}
