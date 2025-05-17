import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          Loading plot details...
        </p>
      </div>
    </div>
  );
}
