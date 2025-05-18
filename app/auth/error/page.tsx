"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
      <p className="text-red-500">Error: {error}</p>
    </div>
  );
}
