import CheckoutFailureClient from "./CheckoutFailureClient";

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; reason?: "failed" | "cancelled" }>;
}) {
  const params = await searchParams;
  return <CheckoutFailureClient orderId={params.orderId} reason={params.reason} />;
}
