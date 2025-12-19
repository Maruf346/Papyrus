import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaPenNib,
  FaHistory,
  FaUser,
  FaSearch,
  FaBolt,
  FaFileAlt,
  FaSlidersH,
  FaArrowRight,
} from "react-icons/fa";

const Search = () => {
  const navigate = useNavigate();
  const [abstract, setAbstract] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!abstract.trim()) {
      alert("Please enter an abstract to get recommendations");
      return;
    }

    setIsSubmitting(true);

    try {
      // Navigate to recommendations page with the abstract data
      navigate("/recommendations", {
        state: {
          abstract: abstract.trim(),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-20 sm:w-24 bg-stone-100 border-r border-stone-200 flex flex-col items-center py-6">

        {/* Logo */}
        <div className="mb-8">
          <img
            src="/icon.png"
            alt="Papyrus Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-8 w-full items-center">

          {/* Home */}
          <a
            href="/"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-200 group-hover:bg-stone-300 transition">
              <FaHome className="h-6 w-6 text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-700">Home</p>
          </a>

          {/* References */}
          <a
            href="/references"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-100 group-hover:bg-stone-200 transition">
              <FaBook className="h-6 w-6 text-stone-600 group-hover:text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-600 group-hover:text-stone-900">
              References
            </p>
          </a>

          {/* Writer */}
          <a
            href="/writer"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-100 group-hover:bg-stone-200 transition">
              <FaPenNib className="h-6 w-6 text-stone-600 group-hover:text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-600 group-hover:text-stone-900">
              Writer
            </p>
          </a>

          {/* History */}
          <a
            href="/history"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-100 group-hover:bg-stone-200 transition">
              <FaHistory className="h-6 w-6 text-stone-600 group-hover:text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-600 group-hover:text-stone-900">
              History
            </p>
          </a>
        </nav>

        {/* User Avatar (bottom) */}
        <div className="mt-auto mb-20">
          <button className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center overflow-hidden">
            <img
              src="/maruf.jpg"
              alt="User"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

      </aside>

      {/* Main Search Page Content */}
      <main className="flex-1 p-10">
        <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4">

          {/* Greeting */}
          <h1 className="text-3xl font-bold text-stone-900 mb-10">
            Hello, Maruf 👋
          </h1>

          {/* Search block container */}
          <div className="w-full max-w-3xl bg-stone-100 rounded-2xl border border-stone-200 p-4 shadow-sm">

            {/* Top Tabs */}
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 bg-stone-900 text-white px-3 py-2 rounded-lg text-sm font-medium">
                <FaSearch /> AI Search
              </button>

              <button className="flex items-center gap-2 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-200">
                <FaBolt className="text-amber-500" /> Deep Research
              </button>

              <button className="flex items-center gap-2 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-200">
                <FaBook /> Literature Review
              </button>

              <button className="flex items-center gap-2 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-200">
                <FaFileAlt /> Chat with PDF
              </button>

              <button className="flex items-center gap-2 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-200">
                <FaSlidersH /> Extract Data
              </button>
            </div>

            {/* Form for abstract submission */}
            <form onSubmit={handleSubmit} className="mt-4">
              {/* Textarea Box */}
              <div className="bg-white rounded-xl border border-stone-200 p-4 relative">
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Paste your research abstract here to get paper recommendations"
                  className="w-full h-24 resize-none outline-none text-stone-700 placeholder-stone-400"
                  disabled={isSubmitting}
                />

                {/* Character count */}
                <div className="text-xs text-stone-500 mt-2 text-right">
                  {abstract.length} characters
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !abstract.trim()}
                  className={`absolute right-4 bottom-4 p-2 rounded-lg transition ${isSubmitting || !abstract.trim()
                    ? 'bg-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 active:scale-95'
                    } text-white`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <FaArrowRight />
                  )}
                </button>
              </div>

              {/* Instructions 
              <div className="mt-3 text-sm text-stone-600">
                <p className="mb-1">💡 <strong>How it works:</strong></p>
                <p className="text-xs text-stone-500">
                  1. Paste your research abstract above<br />
                  2. Click submit to get AI-powered paper recommendations<br />
                  3. View 10 most relevant papers based on your abstract
                </p>
              </div>
              */}
            </form>

            {/* Filters button */}
            <button className="flex items-center gap-2 text-stone-600 text-sm mt-2 hover:text-stone-900">
              <FaSlidersH className="text-base" />
              Filters
            </button>
          </div>

          {/* Bottom feature cards */}
          <div className="w-full max-w-3xl mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Reference Manager */}
            <div className="block bg-stone-100 border rounded-xl p-5 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-stone-900">
                Reference Manager
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Manage, Annotate, Understand and Cite References
              </p>
            </div>

            {/* AI Writer */}
            <div className="block bg-stone-100 border rounded-xl p-5 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-stone-900">
                AI Writer
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Write, Improve and Cite better and faster
              </p>
            </div>

          </div>

          {/* Recent Abstracts (Optional - could be added later) */}
          <div className="w-full max-w-3xl mt-12">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Recent Recommendations</h2>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <p className="text-sm text-stone-600 text-center">
                Your recent recommendations will appear here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;