import CheckoutClient from "./checkout-client";

export default async function CheckoutPage(props: any) {
  const maybeParams = props?.params;
  const params = maybeParams && typeof maybeParams.then === "function" ? await maybeParams : maybeParams;
  return <CheckoutClient packageId={params?.packageId as string} />;
}


