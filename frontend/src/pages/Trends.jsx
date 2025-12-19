import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import {
  FaChartLine,
  FaCalendarAlt,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaFire,
  FaFilter,
  FaSortAmountDown,
  FaGlobe,
  FaSearch,
  FaChartBar,
  FaHistory,
  FaSortNumericDown,
  FaChevronUp,
  FaChevronDown
} from "react-icons/fa";

const Trends = () => {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('total_papers'); // total_papers, category_name, peak_year

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/papers/trends/?top_n=${topN}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setTrendsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching trends:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [topN]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-stone-900 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading research trends...</p>
          <p className="text-stone-400 mt-2">Analyzing publication patterns</p>
        </div>
      </>
    );
  }

  if (error || !trendsData) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Unable to Load Trends</h2>
            <p className="text-stone-600 mb-6">
              {error || "Failed to load trend data. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // Process the trends data
  const processTrendsData = () => {
    const processed = [];

    for (const [category, years] of Object.entries(trendsData.trends)) {
      const yearEntries = Object.entries(years);
      const totalPapers = Object.values(years).reduce((sum, count) => sum + count, 0);
      const yearRange = Object.keys(years).map(Number);
      const startYear = Math.min(...yearRange);
      const endYear = Math.max(...yearRange);

      // Find peak year
      let peakYear = null;
      let peakCount = 0;
      for (const [year, count] of yearEntries) {
        if (count > peakCount) {
          peakCount = count;
          peakYear = parseInt(year);
        }
      }

      // Calculate trend direction
      const yearsSorted = yearEntries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const recentTrend = yearsSorted.length >= 2
        ? yearsSorted[yearsSorted.length - 1][1] - yearsSorted[yearsSorted.length - 2][1]
        : 0;

      processed.push({
        category,
        years,
        totalPapers,
        startYear,
        endYear,
        peakYear,
        peakCount,
        recentTrend,
        yearEntries: yearEntries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      });
    }

    // Sort based on selected criteria
    return processed.sort((a, b) => {
      switch (sortBy) {
        case 'category_name':
          return a.category.localeCompare(b.category);
        case 'peak_year':
          return b.peakYear - a.peakYear;
        case 'total_papers':
        default:
          return b.totalPapers - a.totalPapers;
      }
    });
  };

  const processedData = processTrendsData();
  const selectedCategoryData = selectedCategory
    ? processedData.find(item => item.category === selectedCategory)
    : null;

  // Calculate overall statistics
  const totalCategories = processedData.length;
  const totalAllPapers = processedData.reduce((sum, item) => sum + item.totalPapers, 0);
  const avgPapersPerCategory = Math.round(totalAllPapers / totalCategories);
  const categoriesWithGrowth = processedData.filter(item => item.recentTrend > 0).length;

  // Get year range from all data
  const allYears = new Set();
  processedData.forEach(item => {
    Object.keys(item.years).forEach(year => allYears.add(parseInt(year)));
  });
  const sortedYears = Array.from(allYears).sort((a, b) => a - b);
  const startYearOverall = Math.min(...sortedYears);
  const endYearOverall = Math.max(...sortedYears);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-16 px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaChartLine className="text-3xl text-yellow-300" />
                  </div>
                  <h1 className="text-4xl font-bold">Research Trends Dashboard</h1>
                </div>
                <p className="text-lg text-purple-200 mb-6 max-w-3xl">
                  Explore publication patterns, track emerging fields, and analyze research trends
                  across academic categories from {startYearOverall} to {endYearOverall}.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaFileAlt className="text-yellow-300" />
                    <span className="font-semibold">{totalAllPapers.toLocaleString()}</span>
                    <span>total papers analyzed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaGlobe className="text-green-300" />
                    <span className="font-semibold">{totalCategories}</span>
                    <span>research categories</span>
                  </div>
                </div>
              </div>

              {/* Top N Selector */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaFilter className="text-yellow-300" />
                  <h3 className="font-semibold">Display Top Categories</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 50, 100].map(num => (
                    <button
                      key={num}
                      onClick={() => setTopN(num)}
                      className={`px-4 py-2 rounded-lg transition ${topN === num
                          ? 'bg-yellow-500 text-gray-900 font-bold'
                          : 'bg-white/20 hover:bg-white/30'
                        }`}
                    >
                      Top {num}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-purple-200 mt-3">
                  Currently showing: <span className="font-bold">Top {topN}</span> categories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaFileAlt className="text-2xl text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{totalAllPapers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Publications</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FaChartLine className="text-2xl text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{categoriesWithGrowth}</div>
                  <div className="text-sm text-gray-600">Growing Categories</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FaCalendarAlt className="text-2xl text-purple-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{endYearOverall - startYearOverall + 1}</div>
                  <div className="text-sm text-gray-600">Years Analyzed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-6 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <FaFire className="text-2xl text-amber-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{avgPapersPerCategory.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg/Category</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Categories List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FaSearch className="text-purple-600" />
                    Research Categories
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <FaSortAmountDown className="text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                      >
                        <option value="total_papers">Sort by: Total Papers</option>
                        <option value="category_name">Sort by: Category Name</option>
                        <option value="peak_year">Sort by: Peak Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {processedData.map((item, index) => (
                    <div
                      key={item.category}
                      className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${selectedCategory === item.category
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                        }`}
                      onClick={() => setSelectedCategory(item.category)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700">
                              #{index + 1}
                            </span>
                            <h3 className="font-bold text-gray-900 truncate">
                              {item.category}
                            </h3>
                            {item.recentTrend > 0 ? (
                              <span className="flex items-center gap-1 text-sm text-green-600">
                                <FaArrowUp />
                                <span>+{item.recentTrend}</span>
                              </span>
                            ) : item.recentTrend < 0 ? (
                              <span className="flex items-center gap-1 text-sm text-red-600">
                                <FaArrowDown />
                                <span>{item.recentTrend}</span>
                              </span>
                            ) : null}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FaFileAlt className="text-gray-400" />
                              <span>{item.totalPapers.toLocaleString()} papers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt className="text-gray-400" />
                              <span>{item.startYear} - {item.endYear}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaFire className="text-amber-500" />
                              <span>Peak: {item.peakYear} ({item.peakCount} papers)</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {item.totalPapers.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">papers</div>
                        </div>
                      </div>

                      {/* Mini bar chart */}
                      <div className="mt-3">
                        <div className="flex items-end h-8 gap-1">
                          {item.yearEntries.slice(-8).map(([year, count]) => {
                            const maxCount = Math.max(...item.yearEntries.map(([_, c]) => c));
                            const height = (count / maxCount) * 100;
                            return (
                              <div
                                key={year}
                                title={`${year}: ${count} papers`}
                                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                                style={{ height: `${Math.max(10, height)}%` }}
                              >
                                <div className="text-xs text-center text-white opacity-0 hover:opacity-100 transition">
                                  {count}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{item.yearEntries[0]?.[0] || ''}</span>
                          <span>Year</span>
                          <span>{item.yearEntries[item.yearEntries.length - 1]?.[0] || ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Category Details */}
            <div className="space-y-8">
              {/* Selected Category Details */}
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-6 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaChartBar className="text-purple-600" />
                  {selectedCategory ? 'Category Details' : 'Select a Category'}
                </h2>

                {selectedCategoryData ? (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-bold text-lg">
                        {selectedCategoryData.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="text-3xl font-bold text-purple-700">
                          {selectedCategoryData.totalPapers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Papers</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="text-3xl font-bold text-blue-700">
                          {selectedCategoryData.peakCount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Peak Year ({selectedCategoryData.peakYear})</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Yearly Distribution</h3>
                      <div className="space-y-2">
                        {selectedCategoryData.yearEntries.map(([year, count]) => (
                          <div key={year} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-20 text-sm text-gray-600">{year}</div>
                              <div className="flex-1">
                                <div
                                  className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                                  style={{
                                    width: `${(count / selectedCategoryData.peakCount) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                            <div className="w-16 text-right font-semibold text-gray-900">
                              {count.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <FaHistory className="text-green-500" />
                          <span>Time Span:</span>
                        </div>
                        <span className="font-semibold">
                          {selectedCategoryData.endYear - selectedCategoryData.startYear + 1} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <div className="flex items-center gap-2">
                          <FaArrowUp className="text-blue-500" />
                          <span>Recent Trend:</span>
                        </div>
                        <span className={`font-semibold ${selectedCategoryData.recentTrend > 0
                            ? 'text-green-600'
                            : selectedCategoryData.recentTrend < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}>
                          {selectedCategoryData.recentTrend > 0 ? '+' : ''}{selectedCategoryData.recentTrend} papers
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">📈</div>
                    <p className="text-gray-600">
                      Click on any research category to view detailed trends and statistics.
                    </p>
                  </div>
                )}
              </div>

              {/* Insights Panel */}
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-6 border border-amber-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaFire className="text-amber-600" />
                  Quick Insights
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-white/50 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-1">
                      📊 Most Prolific Category
                    </div>
                    <p className="text-sm text-gray-600">
                      {processedData[0]?.category} with {processedData[0]?.totalPapers.toLocaleString()} papers
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-1">
                      🔥 Most Recent Growth
                    </div>
                    <p className="text-sm text-gray-600">
                      {processedData.filter(item => item.recentTrend > 0).length} categories showing growth
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-1">
                      📅 Longest Time Series
                    </div>
                    <p className="text-sm text-gray-600">
                      Data spans from {startYearOverall} to {endYearOverall}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Overview */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-blue-600" />
              Publication Timeline Overview
            </h2>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-center text-gray-500 italic">
                Year-over-year publication count across all categories
              </div>
              {/* Placeholder for a proper chart - you can add Chart.js or similar later */}
              <div className="h-64 flex items-center justify-center my-4">
                <div className="text-center">
                  <div className="text-5xl mb-4">📅</div>
                  <p className="text-gray-600">
                    Chart visualization would show yearly trends
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Consider integrating Chart.js for interactive charts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-500 text-sm">
              <p>Trends data analyzed from academic publications • Updated weekly</p>
              <p className="mt-2">
                Showing top {topN} categories based on publication volume
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Trends;