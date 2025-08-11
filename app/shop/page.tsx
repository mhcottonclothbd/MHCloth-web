import { Suspense } from "react";

import ShopPageClient from "./widget/ShopPageClient";

export const dynamic = "force-dynamic";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageClient />
    </Suspense>
  );
}
