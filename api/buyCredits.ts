import { useMutation } from "@tanstack/react-query";

export const useBuyCredits = () => {
  return useMutation({
    mutationFn: async ({
      credits,
      userId,
      price,
    }: {
      credits: number;
      userId: string;
      price: number;
    }) => {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits, userId, price }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Failed to create checkout session");
      }

      return data.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
};
