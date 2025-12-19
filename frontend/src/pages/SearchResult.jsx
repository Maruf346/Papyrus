import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { FaCalendarAlt, FaUserFriends, FaBookOpen, FaExternalLinkAlt, FaTag } from "react-icons/fa";

export default function SearchResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const query = searchParams.get("q");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [topN, setTopN] = useState(12); // Added top_n state

    useEffect(() => {
        if (!query) return;

        setLoading(true);

        // Modified API call to include top_n parameter
        fetch(`http://127.0.0.1:8000/api/papers/search/?q=${encodeURIComponent(query)}&top_n=${topN}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Search fetch error:", err);
                setLoading(false);
            });
    }, [query, topN]); // Added topN to dependency array

    if (!query) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
                    <p className="text-stone-600 mb-4 text-lg">Please enter a search query.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition shadow-md"
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
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-stone-900 mb-4"></div>
                    <p className="text-stone-600 text-lg">Searching for papers...</p>
                    <p className="text-stone-400 mt-2">"{query}"</p>
                </div>
            </>
        );
    }

    if (!results || results.count === 0) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
                    <div className="text-center max-w-lg">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-stone-800 mb-2">No papers found</h2>
                        <p className="text-stone-600 mb-6">
                            We couldn't find any papers matching "<span className="font-semibold">{query}</span>".
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition shadow-md"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Helper function to truncate text
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    // Format categories
    const formatCategories = (categories) => {
        if (!categories) return [];
        return categories.split(' ').map(cat => cat.trim());
    };

    // Calculate reading time (rough estimate)
    const calculateReadingTime = (abstract) => {
        const wordsPerMinute = 200;
        const wordCount = abstract.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-stone-900 to-gray-800 text-white py-12 px-10">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-3">
                            Results for "<span className="text-amber-200">{query}</span>"
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-stone-200">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <FaBookOpen className="text-amber-300" />
                                <span className="font-semibold">{results.count}</span>
                                <span>papers found</span>
                            </div>
                            <div className="hidden md:block text-stone-300">
                                • Click on any paper to explore details
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Filters Bar - Added top_n selector */}
                    <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
                        <div className="text-stone-600">
                            Showing top <span className="font-bold">{topN}</span> of {results.count} papers
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Added top_n dropdown */}
                            <select
                                value={topN}
                                onChange={(e) => setTopN(Number(e.target.value))}
                                className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm"
                            >
                                <option value={10}>Top 10</option>
                                <option value={20}>Top 20</option>
                                <option value={30}>Top 30</option>
                                <option value={40}>Top 40</option>
                                <option value={50}>Top 50</option>
                                <option value={100}>Top 100</option>
                            </select>

                            <select className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm">
                                <option>Sort by: Relevance</option>
                                <option>Newest First</option>
                                <option>Oldest First</option>
                            </select>
                            <select className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm">
                                <option>Filter by Category</option>
                                <option>Computer Science</option>
                                <option>Physics</option>
                                <option>Mathematics</option>
                            </select>
                        </div>
                    </div>

                    {/* Papers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {results.results.map((paper, index) => (
                            <div
                                key={paper.id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                                onClick={() => navigate(`/paper/${paper.id}`)}
                            >
                                {/* Card Header with Gradient */}
                                <div className="p-6 pb-4 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700">
                                            {formatCategories(paper.categories)[0] || "Research"}
                                        </span>
                                        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 leading-tight mb-3 group-hover:text-blue-600 transition">
                                        {truncateText(paper.title, 120)}
                                    </h3>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 pt-4">
                                    {/* Authors */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <FaUserFriends className="text-stone-400 mt-1 flex-shrink-0" />
                                        <p className="text-sm text-stone-600 line-clamp-2">
                                            {truncateText(paper.authors, 80)}
                                        </p>
                                    </div>

                                    {/* Abstract Preview */}
                                    <div className="mb-6">
                                        <p className="text-sm text-stone-700 line-clamp-3 mb-3">
                                            {truncateText(paper.abstract, 200)}
                                        </p>
                                        <div className="text-xs text-stone-500 flex items-center gap-1">
                                            <FaBookOpen />
                                            <span>{calculateReadingTime(paper.abstract)} min read</span>
                                        </div>
                                    </div>

                                    {/* Metadata Footer */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex flex-wrap justify-between items-center gap-3">
                                            <div className="flex items-center gap-4 text-xs text-stone-500">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt />
                                                    <span>{paper.publication_year}</span>
                                                </div>
                                                {paper.doi && (
                                                    <div
                                                        className="flex items-center gap-1 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent card click
                                                            navigate(`/paper/${paper.id}`);
                                                        }}
                                                    >
                                                        <FaExternalLinkAlt />
                                                        <span className="text-blue-600 hover:underline">Details</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Categories Tags */}
                                            <div className="flex flex-wrap gap-1">
                                                {formatCategories(paper.categories).slice(0, 2).map((cat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600 flex items-center gap-1"
                                                    >
                                                        <FaTag className="text-xs" />
                                                        {cat}
                                                    </span>
                                                ))}
                                                {formatCategories(paper.categories).length > 2 && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                                                        +{formatCategories(paper.categories).length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Action Button */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-stone-900 text-white p-2 rounded-lg shadow-lg hover:bg-stone-800 transition">
                                        <FaExternalLinkAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Statistics Section - Updated first stat card */}
                    <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-2xl p-8 mb-12 border border-gray-200">
                        <h2 className="text-2xl font-bold text-stone-800 mb-6">Search Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{topN}</div>
                                <div className="text-stone-700 font-semibold">Results Limit</div>
                                <div className="text-sm text-stone-500 mt-1">Showing top {topN} papers</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {Math.round(results.results.reduce((acc, paper) => acc + paper.publication_year, 0) / results.results.length)}
                                </div>
                                <div className="text-stone-700 font-semibold">Average Year</div>
                                <div className="text-sm text-stone-500 mt-1">Of publication</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {new Set(results.results.flatMap(p => formatCategories(p.categories))).size}
                                </div>
                                <div className="text-stone-700 font-semibold">Unique Categories</div>
                                <div className="text-sm text-stone-500 mt-1">Across all papers</div>
                            </div>
                        </div>
                    </div>

                    {/* Related Searches */}
                    <div className="mb-12">
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Related Searches</h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                `${query} machine learning`,
                                `${query} applications`,
                                `${query} survey`,
                                `${query} recent developments`,
                                `${query} algorithms`
                            ].map((related, idx) => (
                                <button
                                    key={idx}
                                    className="px-4 py-2 bg-white border rounded-full text-sm text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition shadow-sm"
                                    onClick={() => navigate(`/search-results?q=${encodeURIComponent(related)}`)}
                                >
                                    {related}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pagination (if you add it later) */}
                    <div className="flex justify-center items-center gap-2">
                        <button className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50 disabled:opacity-50">
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-stone-900 text-white rounded-lg">1</span>
                        <button className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50">
                            Next
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="border-t border-gray-200 bg-white py-8">
                    <div className="max-w-7xl mx-auto px-4 text-center text-stone-500 text-sm">
                        <p>Search powered by academic database • Results updated daily</p>
                        <p className="mt-2">
                            Found something inaccurate? <a href="#" className="text-blue-600 hover:underline">Report an issue</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Tailwind CSS for line clamping */}
            <style jsx>{`
                .line-clamp-2 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                .line-clamp-3 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                }
            `}</style>
        </>
    );
}