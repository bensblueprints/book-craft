import prisma from "@/server/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || "0", 10);

    if (userId && credits) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: credits },
        },
      });

      // add purchase history
      await prisma.purchaseHistory.create({
        data: {
          credits,
          userId,
          title: "1 Package",
          price: session.amount_total ? session.amount_total / 100 : 0,
          status: "COMPLETED",
        },
      });
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
