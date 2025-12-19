import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/papers/search/?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      setIsSearchOpen(false);

      navigate("/search-results", {
        state: { query, results: data },
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* 🔴 Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  /* 🔴 Close on ESC key */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="relative flex items-center justify-between h-20 px-6 lg:px-20 border-b">

      {/* 🔴 Blur background when search open */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0"></div>
      )}

      {/* Left */}
      <div className="flex items-center gap-6 z-10">
        <Link to="/">
          <img src="/image.png" alt="Papyrus" className="w-40 hidden sm:block" />
          <img src="/image.png" alt="logo" className="w-8 sm:hidden" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link to="#find-papers" className="hover:text-stone-900">Features</Link>
          <Link to="/search" className="hover:text-stone-900">Recommender</Link>
          <Link to="/trends" className="hover:text-stone-900">Trends</Link>
          <Link to="/about" className="hover:text-stone-900">About</Link>
        </nav>
      </div>

      {/* 🔍 CENTER SEARCH */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-10">
        {isSearchOpen && (
          <form
            ref={searchRef}
            onSubmit={handleSearch}
            className="flex items-center bg-white border rounded-full px-5 py-3 shadow-lg animate-search"
          >
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search research papers..."
              className="flex-1 outline-none text-stone-700 placeholder-stone-400"
            />

            <button
              type="submit"
              className="ml-3 w-10 h-10 flex items-center justify-center rounded-full bg-stone-900 text-white hover:bg-stone-800 transition"
            >
              <FaSearch />
            </button>
          </form>
        )}
      </div>

      {/* Right */}
      <div className="hidden lg:flex items-center gap-4 z-10">
        <button
          onClick={() => setIsSearchOpen((prev) => !prev)}
          className="p-2 rounded-full border hover:bg-stone-100 transition"
        >
          <FaSearch />
        </button>

        <button className="py-2.5 px-4 border rounded text-sm font-semibold">
          Log in
        </button>

        <Link
          to="/search"
          className="py-2 px-4 bg-stone-900 text-white rounded text-sm"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
