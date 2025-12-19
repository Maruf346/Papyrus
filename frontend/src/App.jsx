import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Search from './pages/Search'
import Trends from './pages/Trends'
import SearchResult from './pages/SearchResult'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/trends" element={<Trends/>} />
      <Route path="/search-results" element={<SearchResult/>} />
    </Routes>
  )
}
