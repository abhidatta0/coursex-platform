import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {captureAndFinalizePayment} from './api'
import { useRef, useEffect } from "react";
import { useLocation } from "react-router";

const PaymentReturn = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!paymentId || hasCalledRef.current) return;

    hasCalledRef.current = true;

    const capturePayment = async () => {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId") ?? "");

      const response = await captureAndFinalizePayment(
        {paymentId,orderId}
      );
      console.log({response});

      if (response.status == 200) {
        sessionStorage.removeItem("currentOrderId");
        window.location.href = "/student-courses";
      }
    };

    capturePayment();
  }, [paymentId]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  )
}
export default PaymentReturn;