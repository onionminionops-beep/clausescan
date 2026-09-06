"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture("$exception", {
        $exception_message: error.message,
        $exception_type: error.name,
        $exception_stack_trace: error.stack,
      });
    }
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">We apologize for the inconvenience.</p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
