import VerifyingClient from "./VerifyingClient";

export default async function CheckoutVerifyingPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <VerifyingClient
      orderId={params.orderId}
      razorpayOrderId={params.razorpay_order_id}
      razorpayPaymentId={params.razorpay_payment_id}
      razorpaySignature={params.razorpay_signature}
    />
  );
}
