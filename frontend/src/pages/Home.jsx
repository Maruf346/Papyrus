import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import FeaturesGrid from '../components/FeaturesGrid'
import Footer from '../components/Footer'

export default function Home(){
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="space-y-16 px-6 md:px-10 lg:px-20 xl:px-40">
        <Hero />
        <FeaturesGrid />
        {/* other sections copied from the HTML: testimonials, pricing callouts, etc */}
      </main>
      <Footer />
    </div>
  )
}
