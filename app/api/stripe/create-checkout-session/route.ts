import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const { credits, price, userId } = await req.json();

  // Map credits to Stripe prices or amounts dynamically
  // const creditPriceMap: Record<number, number> = {
  //   10: 500,
  //   50: 2000,
  //   100: 3500,
  // };

  // const amount = creditPriceMap[credits];
  // if (!amount) {
  //   return NextResponse.json(
  //     { error: "Invalid credit amount" },
  //     { status: 400 }
  //   );
  // }

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${credits} Credits`,
          },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      credits: String(credits),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?purchase_status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?purchase_status=cancelled`,
  });

  return NextResponse.json({ url: stripeSession.url });
}
