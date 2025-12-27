import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {captureAndFinalizePayment} from './api'
import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!paymentId || hasCalledRef.current) return;

    hasCalledRef.current = true;

    const capturePayment = async () => {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId") ?? "");

      try{
        const data = await captureAndFinalizePayment(
          {paymentId,orderId}
        );
        console.log({data})

        sessionStorage.removeItem("currentOrderId");

        window.location.href = "/courses";
      }catch{
        
        toast.error("Failed to make payment.Please try again",{ position:'top-center'});
       
        setTimeout(()=>{
          navigate(-1);
        },200)
      }
    };

    capturePayment();
  }, [paymentId, navigate]);


  return (
    <Card className="h-screen">
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  )
}
export default PaymentReturn;