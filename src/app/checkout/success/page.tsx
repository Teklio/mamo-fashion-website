import CheckoutSuccessClient from "./CheckoutSuccessClient";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  return <CheckoutSuccessClient orderId={params.orderId} />;
}
