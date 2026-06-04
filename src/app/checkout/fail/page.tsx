import { redirect } from "next/navigation";

export default async function LegacyCheckoutFailPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; result?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  if (params.orderId) qs.set("orderId", params.orderId);
  if (params.result) qs.set("result", params.result);

  redirect(`/checkout/failure${qs.toString() ? `?${qs.toString()}` : ""}`);
}
