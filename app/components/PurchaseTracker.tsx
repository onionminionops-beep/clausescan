"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PurchaseTracker({ product }: { product: string }) {
  useEffect(() => {
    try {
      posthog.capture("payment_success", { product });
    } catch {
      /* ignore */
    }
  }, [product]);
  return null;
}
