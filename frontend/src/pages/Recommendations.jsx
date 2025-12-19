import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import {
  FaCalendarAlt,
  FaUserFriends,
  FaBookOpen,
  FaExternalLinkAlt,
  FaTag,
  FaArrowLeft,
  FaLightbulb,
  FaCheckCircle,
  FaStar,
  FaChartLine,
  FaSeedling,
  FaFileMedical,
  FaMagic,
  FaRocket
} from "react-icons/fa";

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalAbstract, setOriginalAbstract] = useState("");
  const [topN, setTopN] = useState(10); // For consistency with search page

  useEffect(() => {
    // Get abstract from location state
    const abstract = location.state?.abstract || "";
    setOriginalAbstract(abstract);

    if (!abstract.trim()) {
      setError("No abstract provided. Please go back and enter an abstract.");
      setLoading(false);
      return;
    }

    // Fetch recommendations from backend
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user-uploads/recommend/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "",
            authors: "",
            abstract: abstract,
            categories: ""
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [location]);

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Format categories
  const formatCategories = (categories) => {
    if (!categories) return [];
    return categories.split(' ').map(cat => cat.trim());
  };

  // Calculate reading time (rough estimate)
  const calculateReadingTime = (abstract) => {
    if (!abstract) return 0;
    const wordsPerMinute = 200;
    const wordCount = abstract.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Calculate match percentage (simulated for now - backend should provide this)
  const calculateMatchPercentage = (index) => {
    // This should come from backend, but for now simulate decreasing percentage
    return Math.max(85, 100 - (index * 1.5));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
          <div className="text-center max-w-lg">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
              <FaMagic className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">Finding Perfect Matches</h2>
            <p className="text-stone-600 mb-2">Analyzing your abstract with AI...</p>
            <p className="text-stone-400 text-sm">Searching through millions of papers for the most relevant matches</p>
            <div className="mt-6 w-full bg-stone-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Recommendation Error</h2>
            <p className="text-stone-600 mb-6">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
              >
                <FaArrowLeft className="inline mr-2" />
                Go Back
              </button>
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!recommendations || !recommendations.results || recommendations.results.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">No Recommendations Found</h2>
            <p className="text-stone-600 mb-6">
              We couldn't find papers matching your abstract. Try adjusting your query.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
              >
                <FaArrowLeft className="inline mr-2" />
                Go Back
              </button>
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition shadow-md"
              >
                New Search
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const resultsCount = recommendations.results.length;
  const hasHighMatch = resultsCount > 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-12 px-10">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition"
            >
              <FaArrowLeft />
              <span>Back to Search</span>
            </button>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaRocket className="text-3xl text-yellow-300" />
                  </div>
                  <h1 className="text-4xl font-bold">AI-Powered Recommendations</h1>
                </div>
                <p className="text-lg text-purple-200 mb-6">
                  Based on your research abstract, we've found the most relevant papers
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaLightbulb className="text-yellow-300" />
                    <span className="font-semibold">{resultsCount}</span>
                    <span>perfect matches found</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaChartLine className="text-green-300" />
                    <span>AI-powered matching</span>
                  </div>
                </div>
              </div>
              
              {/* Match Quality Indicator */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-green-400 text-2xl" />
                  <h3 className="font-semibold">Match Quality</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {hasHighMatch ? "Excellent" : "Good"}
                  </div>
                  <div className="text-sm text-purple-200">
                    {hasHighMatch 
                      ? "High relevance matches found" 
                      : "Moderate relevance matches"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Abstract Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-200">
            <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
              <FaFileMedical className="text-blue-600" />
              Your Original Abstract
            </h2>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <p className="text-stone-700 leading-relaxed whitespace-pre-line">
                {truncateText(originalAbstract, 500)}
                {originalAbstract.length > 500 && (
                  <span className="text-blue-600 ml-2 cursor-pointer hover:underline">
                    ...see more
                  </span>
                )}
              </p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-100">
                <div className="text-sm text-stone-500">
                  {originalAbstract.split(/\s+/).length} words • {calculateReadingTime(originalAbstract)} min read
                </div>
                <button
                  onClick={() => navigate("/search")}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Edit Abstract
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations Header */}
          <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">
                Recommended Papers
              </h2>
              <p className="text-stone-600">
                Top {resultsCount} papers matching your research interests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-stone-500">
                Sorted by: <span className="font-semibold text-stone-900">Relevance</span>
              </div>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {recommendations.results.map((paper, index) => {
              const matchPercentage = calculateMatchPercentage(index);
              
              return (
                <div
                  key={paper.paper_id || paper.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer transform hover:-translate-y-1 relative"
                  onClick={() => navigate(`/paper/${paper.paper_id || paper.id}`)}
                >
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                      <FaStar className="text-yellow-300 text-xs" />
                      <span className="font-bold">{matchPercentage}%</span>
                      <span className="text-xs opacity-90">match</span>
                    </div>
                  </div>

                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700">
                        {formatCategories(paper.categories)[0] || "Research"}
                      </span>
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 leading-tight mb-3 group-hover:text-purple-600 transition line-clamp-2">
                      {truncateText(paper.title, 100)}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 pt-4">
                    {/* Authors */}
                    <div className="flex items-start gap-2 mb-4">
                      <FaUserFriends className="text-stone-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {truncateText(paper.authors, 60)}
                      </p>
                    </div>

                    {/* Abstract Preview */}
                    <div className="mb-6">
                      <p className="text-sm text-stone-700 line-clamp-3 mb-3">
                        {truncateText(paper.abstract, 150)}
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
                                e.stopPropagation();
                                navigate(`/paper/${paper.paper_id || paper.id}`);
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/paper/${paper.paper_id || paper.id}`);
                      }}
                      className="bg-purple-600 text-white p-2 rounded-lg shadow-lg hover:bg-purple-700 transition"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Insights & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Why These Recommendations */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                <FaLightbulb className="text-blue-600" />
                Why These Papers?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaSeedling className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Semantic Similarity</div>
                    <p className="text-sm text-stone-600">Papers with similar concepts and methodologies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaChartLine className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Citation Impact</div>
                    <p className="text-sm text-stone-600">Highly cited and influential works</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaBookOpen className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Recent Relevance</div>
                    <p className="text-sm text-stone-600">Timely research matching current trends</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-100">
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                <FaRocket className="text-amber-600" />
                Next Steps
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/search-results?q=${encodeURIComponent(originalAbstract.split(' ').slice(0, 3).join(' '))}`)}
                  className="w-full text-left p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition"
                >
                  <div className="font-semibold text-stone-900">Search Related Papers</div>
                  <div className="text-sm text-stone-600">Find more papers in this domain</div>
                </button>
                <button
                  onClick={() => alert("Export feature coming soon!")}
                  className="w-full text-left p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition"
                >
                  <div className="font-semibold text-stone-900">Export Results</div>
                  <div className="text-sm text-stone-600">Save these papers to your library</div>
                </button>
                <button
                  onClick={() => navigate("/search")}
                  className="w-full text-left p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition"
                >
                  <div className="font-semibold text-stone-900">New Search</div>
                  <div className="text-sm text-stone-600">Get recommendations for another abstract</div>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                <FaChartLine className="text-green-600" />
                Recommendation Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-green-100">
                  <span className="text-stone-600">Total Papers</span>
                  <span className="font-bold text-stone-900">{resultsCount}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-100">
                  <span className="text-stone-600">Avg. Match Score</span>
                  <span className="font-bold text-green-700">
                    {Math.round(recommendations.results.reduce((acc, _, idx) => 
                      acc + calculateMatchPercentage(idx), 0) / resultsCount)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Year Range</span>
                  <span className="font-bold text-stone-900">
                    {Math.min(...recommendations.results.map(p => p.publication_year))} - 
                    {Math.max(...recommendations.results.map(p => p.publication_year))}
                  </span>
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
                Back to Search
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/trends")}
                  className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition"
                >
                  Explore Trends
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for line clamping */}
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
};

export default Recommendations;