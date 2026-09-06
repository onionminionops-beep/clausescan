"use client";

import PurchaseTracker from "@/app/components/PurchaseTracker";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (sessionId) {
      fetch(`/api/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setVerified(data.verified);
          setVerifying(false);
          
          if (data.verified) {
            localStorage.setItem("clausescan_paid", "true");
          }
        })
        .catch(() => {
          setVerifying(false);
        });
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  if (verifying) {
    return (
      <>
      <PurchaseTracker product="clausescan" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <PurchaseTracker product="ClauseScan" />
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm text-center">
        {verified ? (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              You now have full access to ClauseScan analysis.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Analyze Another Contract
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t verify your payment. Please contact support.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}