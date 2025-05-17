"use client";
import PaymentStatusModal from "@/components/dashboard/PaymentStatusModal";
import HomePage from "@/components/HomePage";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex-grow">
      <Suspense>
        <PaymentStatusModal />
      </Suspense>
      <HomePage />
    </main>
  );
}
