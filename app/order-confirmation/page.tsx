
import { Suspense } from "react";
import OrderConfirmationPage from "./OrderConfirmationPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
