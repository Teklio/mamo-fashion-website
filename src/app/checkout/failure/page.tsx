import CheckoutFailureClient from "./CheckoutFailureClient";

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; result?: "failed" | "cancelled" }>;
}) {
  const params = await searchParams;
  return (
    <CheckoutFailureClient orderId={params.orderId}  />
  );
}
