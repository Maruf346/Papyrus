import React from "react";
import { Link } from "react-router-dom";
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
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-20 sm:w-24 bg-stone-100 border-r border-stone-200 flex flex-col items-center py-6">

        {/* Logo */}
        <Link to="/" className="mb-8">
          <img
            src="/icon.png"
            alt="Papyrus Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-8 w-full items-center">

          {/* Home */}
          <Link
            to="/"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-200 group-hover:bg-stone-300 transition">
              <FaHome className="h-6 w-6 text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-700">Home</p>
          </Link>

          {/* References */}
          <Link
            to="/references"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-100 group-hover:bg-stone-200 transition">
              <FaBook className="h-6 w-6 text-stone-600 group-hover:text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-600 group-hover:text-stone-900">
              References
            </p>
          </Link>

          {/* Writer */}
          <Link
            to="/writer"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-100 group-hover:bg-stone-200 transition">
              <FaPenNib className="h-6 w-6 text-stone-600 group-hover:text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-600 group-hover:text-stone-900">
              Writer
            </p>
          </Link>

          {/* History */}
          <Link
            to="/history"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="p-2 rounded-md bg-stone-100 group-hover:bg-stone-200 transition">
              <FaHistory className="h-6 w-6 text-stone-600 group-hover:text-stone-900" />
            </div>
            <p className="text-[11px] mt-1 text-stone-600 group-hover:text-stone-900">
              History
            </p>
          </Link>
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


            {/* Textarea Box */}
            <div className="mt-4 bg-white rounded-xl border border-stone-200 p-4 relative">
              <textarea
                placeholder="Ask a question and get answers from 220 million research papers"
                className="w-full h-24 resize-none outline-none text-stone-700 placeholder-stone-400"
              />

              {/* Submit Button */}
              <button className="absolute right-4 bottom-4 bg-stone-900 text-white p-2 rounded-lg hover:bg-stone-800 active:scale-95 transition">
                <FaArrowRight />
              </button>
            </div>

            {/* Filters button */}
            <button className="flex items-center gap-2 text-stone-600 text-sm mt-2 hover:text-stone-900">
              <FaSlidersH className="text-base" />
              Filters
            </button>
          </div>

          {/* Bottom feature cards */}
          <div className="w-full max-w-3xl mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Reference Manager */}
            <Link
              to="/references"
              className="block bg-stone-100 border rounded-xl p-5 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-stone-900">
                Reference Manager
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Manage, Annotate, Understand and Cite References
              </p>
            </Link>

            {/* AI Writer */}
            <Link
              to="/writer"
              className="block bg-stone-100 border rounded-xl p-5 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-stone-900">
                AI Writer
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Write, Improve and Cite better and faster
              </p>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
