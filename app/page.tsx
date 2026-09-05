"use client";

import { useState, useEffect } from "react";

interface RiskFlag {
  severity: "red" | "amber";
  title: string;
  why: string;
  rewrite: string;
}

export default function Home() {
  const [contract, setContract] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [flags, setFlags] = useState<RiskFlag[]>([]);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const paid = localStorage.getItem("clausescan_paid") === "true";
    setIsPaid(paid);
  }, []);

  const analyzeContract = async () => {
    if (!contract.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract }),
      });

      const data = await response.json();
      setFlags(data.flags || []);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment setup failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const visibleFlags = isPaid ? flags : flags.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ClauseScan</h1>
          <p className="text-lg text-gray-600">
            Identify risks in your freelance contracts
          </p>
        </header>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Disclaimer:</strong> ClauseScan is not legal advice. This tool provides general information only. 
            Consult a qualified attorney for legal advice specific to your situation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your contract text:
          </label>
          <textarea
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste your freelance contract here..."
          />
          <button
            onClick={analyzeContract}
            disabled={analyzing || !contract.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {analyzing ? "Analyzing..." : "Analyze Contract"}
          </button>
        </div>

        {flags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Risk Flags Found
            </h2>

            <div className="space-y-4">
              {visibleFlags.map((flag, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    flag.severity === "red"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg">
                      {flag.severity === "red" ? "🔴" : "🟡"}
                    </span>
                    <h3 className="font-bold text-gray-900">{flag.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Why this matters:</strong> {flag.why}
                  </p>
                  <p className="text-gray-700">
                    <strong>Suggested rewrite:</strong> {flag.rewrite}
                  </p>
                </div>
              ))}

              {!isPaid && flags.length > 2 && (
                <div className="relative">
                  <div className="blur-sm pointer-events-none p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">🟡</span>
                      <h3 className="font-bold text-gray-900">Additional Risk</h3>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Why this matters:</strong> Lorem ipsum dolor sit amet...
                    </p>
                    <p className="text-gray-700">
                      <strong>Suggested rewrite:</strong> Lorem ipsum dolor sit amet...
                    </p>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Unlock Full Analysis
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Get all {flags.length} risk flags with detailed explanations and suggested rewrites
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-4">$19</p>
                      <button
                        onClick={handlePayment}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Unlock Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      <footer className="mt-12 text-center opacity-70">
        <a href="https://thesaasdir.com/product/clausescan?ref=badge" rel="dofollow">
          <img
            src="https://thesaasdir.com/badge/clausescan.svg"
            alt="Featured on TheSaaSDir"
            width={182}
            height={46}
            className="inline-block"
          />
        </a>
      </footer>
      </div>
    </div>
  );
}
