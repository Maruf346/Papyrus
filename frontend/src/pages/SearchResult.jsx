import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function SearchResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const query = searchParams.get("q");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        setLoading(true);

        fetch(`http://127.0.0.1:8000/api/papers/search/?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Search fetch error:", err);
                setLoading(false);
            });
    }, [query]);

    if (!query) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <p className="text-stone-600 mb-4">Please enter a search query.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-stone-900 text-white rounded"
                    >
                        Go Home
                    </button>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    Loading results…
                </div>
            </>
        );
    }

    if (!results || results.count === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <p className="text-stone-600 mb-4">
                        No papers found for “{query}”.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-stone-900 text-white rounded"
                    >
                        Go Home
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen px-10 py-10">
                <h1 className="text-2xl font-bold mb-6">
                    Search results for “{query}”
                </h1>

                <p className="text-stone-600 mb-4">
                    {results.count} papers found
                </p>

                {/* Temporary debug view */}
                <pre className="bg-stone-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(results.results, null, 2)}
                </pre>
            </div>
        </>
    );
}
