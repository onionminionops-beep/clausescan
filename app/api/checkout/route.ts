import { NextResponse } from "next/server";
import { captureServer } from "@/lib/posthog-server";
import Stripe from "stripe";

const PAYMENT_LINK = "https://buy.stripe.com/6oU28l7v26oo7XY7fgeUU06";

export async function POST() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    await captureServer("anonymous", "checkout_started", { product: "ClauseScan", mode: "payment_link" });
    return NextResponse.json({ url: PAYMENT_LINK });
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1UCQoY7pd3R2ckxOgADAHv5G",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`,
      payment_intent_data: {
        metadata: {
          managed_payments: "false",
        },
      },
    });

    await captureServer("anonymous", "checkout_started", { product: "ClauseScan", mode: "checkout_session" });
      return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    await captureServer("anonymous", "checkout_started", { product: "ClauseScan", mode: "payment_link" });
    return NextResponse.json({ url: PAYMENT_LINK });
  }
}
