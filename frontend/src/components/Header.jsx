import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="flex items-center justify-between h-20 px-6 lg:px-20">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src="/assets/logofull.png" alt="Papyrus" className="w-40 hidden sm:block" />
          <img src="/assets/logo-small.svg" alt="logo" className="w-8 sm:hidden" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link to="/features" className="hover:text-stone-900">Features</Link>
          <Link to="/search" className="hover:text-stone-900">Search</Link>
          <Link to="/about" className="hover:text-stone-900">About</Link>
        </nav>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <button className="text-sm font-semibold px-6 py-2 border">Log in</button>
        <button className="hidden lg:inline-flex items-center py-2 px-4 bg-stone-900 text-white rounded">Get Started</button>
      </div>

      {/* mobile menu button */}
    </header>
  )
}
