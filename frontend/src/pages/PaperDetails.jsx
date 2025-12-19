// pages/PaperDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { 
    FaCalendarAlt, 
    FaUserFriends, 
    FaBookOpen, 
    FaExternalLinkAlt, 
    FaTag, 
    FaArrowLeft,
    FaFileAlt,
    FaUniversity,
    FaLink
} from "react-icons/fa";
import { SiDoi } from "react-icons/si";

export default function PaperDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/papers/${id}/`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setPaper(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching paper:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-stone-900 mb-4"></div>
                    <p className="text-stone-600 text-lg">Loading paper details...</p>
                </div>
            </>
        );
    }

    if (error || !paper) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
                    <div className="text-center max-w-lg">
                        <div className="text-6xl mb-4">📄</div>
                        <h2 className="text-2xl font-bold text-stone-800 mb-2">Paper Not Found</h2>
                        <p className="text-stone-600 mb-6">
                            {error || "The requested paper could not be found."}
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

    const formatCategories = (categories) => {
        if (!categories) return [];
        return categories.split(' ').map(cat => cat.trim());
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Back Navigation */}
                <div className="bg-gradient-to-r from-stone-900 to-gray-800 text-white py-4 px-10">
                    <div className="max-w-7xl mx-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-stone-200 hover:text-white transition"
                        >
                            <FaArrowLeft />
                            <span>Back to Results</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Paper Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                        <div className="flex flex-wrap justify-between items-start mb-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700">
                                        {formatCategories(paper.categories)[0] || "Research"}
                                    </span>
                                    <span className="text-sm text-stone-500 flex items-center gap-1">
                                        <FaCalendarAlt />
                                        Published: {paper.publication_year}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-stone-900 leading-tight mb-4">
                                    {paper.title}
                                </h1>
                                
                                <div className="flex items-start gap-2 mb-6">
                                    <FaUserFriends className="text-stone-400 mt-1 flex-shrink-0" />
                                    <p className="text-lg text-stone-700">
                                        {paper.authors}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 md:mt-0">
                                {paper.doi && (
                                    <a
                                        href={`https://doi.org/${paper.doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition shadow-sm"
                                    >
                                        <SiDoi className="text-lg" />
                                        <span>View DOI</span>
                                    </a>
                                )}
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition shadow-sm"
                                >
                                    <FaArrowLeft />
                                    <span>Back</span>
                                </button>
                            </div>
                        </div>

                        {/* Paper ID Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-sm text-stone-600">
                            <FaFileAlt />
                            <span className="font-mono">ID: {paper.id}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2">
                            {/* Abstract Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FaBookOpen className="text-blue-600 text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-stone-800">Abstract</h2>
                                </div>
                                <div className="prose max-w-none text-stone-700 leading-relaxed">
                                    <p className="whitespace-pre-line text-lg">
                                        {paper.abstract}
                                    </p>
                                </div>
                            </div>

                            {/* Metadata Section */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                                <h2 className="text-2xl font-bold text-stone-800 mb-6">Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-stone-500 mb-2">Categories</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {formatCategories(paper.categories).map((cat, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-stone-50 to-stone-100 text-stone-700 border border-stone-200"
                                                    >
                                                        <FaTag className="text-xs" />
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-sm font-semibold text-stone-500 mb-2">Publication Year</h3>
                                            <div className="flex items-center gap-2 text-lg text-stone-700">
                                                <FaCalendarAlt />
                                                {paper.publication_year}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {paper.journal_ref && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-stone-500 mb-2">Journal Reference</h3>
                                                <div className="flex items-start gap-2 text-stone-700">
                                                    <FaUniversity className="mt-1 flex-shrink-0" />
                                                    <p className="leading-relaxed">{paper.journal_ref}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {paper.doi && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-stone-500 mb-2">DOI</h3>
                                                <a
                                                    href={`https://doi.org/${paper.doi}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    <FaLink />
                                                    {paper.doi}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-8">
                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
                                <h3 className="text-xl font-bold text-stone-800 mb-4">Paper Information</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                                        <span className="text-stone-600">ID</span>
                                        <span className="font-mono font-semibold text-stone-800">{paper.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-blue-100">
                                        <span className="text-stone-600">Year</span>
                                        <span className="font-semibold text-stone-800">{paper.publication_year}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-stone-600">Categories</span>
                                        <span className="font-semibold text-stone-800">{formatCategories(paper.categories).length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-bold text-stone-800 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    {paper.doi && (
                                        <a
                                            href={`https://doi.org/${paper.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                                        >
                                            <FaExternalLinkAlt />
                                            <span>View Full Paper</span>
                                        </a>
                                    )}
                                    <button className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition">
                                        <FaBookOpen />
                                        <span>Save to Library</span>
                                    </button>
                                    <button className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition">
                                        <FaUserFriends />
                                        <span>Cite This Paper</span>
                                    </button>
                                </div>
                            </div>

                            {/* Related Papers (Optional - could fetch from API) */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-bold text-stone-800 mb-4">Related Papers</h3>
                                <p className="text-stone-500 text-sm mb-4">
                                    Papers in similar categories
                                </p>
                                <div className="space-y-3">
                                    {formatCategories(paper.categories).slice(0, 3).map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => navigate(`/search-results?q=${encodeURIComponent(cat)}`)}
                                            className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            {cat} papers →
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
                            >
                                <FaArrowLeft />
                                Back to Results
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/search-results?q=${encodeURIComponent(paper.title.split(' ')[0])}`)}
                                    className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
                                >
                                    Search Similar Papers
                                </button>
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}