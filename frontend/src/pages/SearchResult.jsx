import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🛡️ SAFE fallback
  const query = location.state?.query || "";
  const results = location.state?.results || null;

  // If user directly opens this page
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-stone-600 mb-4">No search data found.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-stone-900 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-10 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Search results for “{query}”
      </h1>

      <p className="text-stone-600 mb-4">
        {results.count} papers found
      </p>

      {/* Temporary display */}
      <pre className="bg-stone-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(results.results, null, 2)}
      </pre>
    </div>
  );
}
