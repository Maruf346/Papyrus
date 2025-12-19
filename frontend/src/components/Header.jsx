import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

export default function Header() {
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = async (e) => {
        e.preventDefault()

        if (!searchQuery.trim()) return

        // 🔥 Backend API call
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/papers/search/?q=${encodeURIComponent(searchQuery)}`
            )
            const data = await response.json()

            // Later you'll store this in global state / context
            console.log("API Response:", data)

            // 🔁 Redirect to search results page
            navigate("/search-results", {
                state: { query: searchQuery, results: data }
            })

        } catch (error) {
            console.error("Search error:", error)
        }
    }

    return (
        <header className="flex items-center justify-between h-20 px-6 lg:px-20 relative">
            
            {/* Left */}
            <div className="flex items-center gap-6">
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

            {/* Right */}
            <div className="hidden lg:flex items-center gap-4">
                
                {/* 🔍 Search Button */}
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="p-2 rounded-full border hover:bg-stone-100"
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

            {/* 🔽 Search Box Dropdown */}
            {showSearch && (
                <form
                    onSubmit={handleSearch}
                    className="absolute top-full right-6 mt-3 bg-white border rounded-xl shadow-lg p-4 w-96 z-50"
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search research papers..."
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />

                    <button
                        type="submit"
                        className="mt-3 w-full bg-stone-900 text-white py-2 rounded-lg hover:bg-stone-800"
                    >
                        Search
                    </button>
                </form>
            )}
        </header>
    )
}
