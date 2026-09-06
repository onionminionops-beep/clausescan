"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PurchaseTracker({ product }: { product: string }) {
  useEffect(() => {
    try {
      posthog.capture("purchase_completed", { product });
    } catch {
      /* ignore */
    }
  }, [product]);
  return null;
}
