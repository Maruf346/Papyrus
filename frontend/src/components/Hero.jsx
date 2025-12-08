import React from 'react'

export default function Hero(){
  return (
    <section className="flex flex-col items-center gap-3 text-center max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-6xl font-bold leading-tight max-w-2xl">
        Your All-in-One
        <div className="bg-gradient-to-b from-[#FFC7AE] to-[#FF4F00] bg-clip-text text-transparent">
          AI Research Assistant
        </div>
      </h1>
      <p className="text-base sm:text-lg text-stone-600">
        Get research backed answers, find &amp; analyze research papers, streamline literature reviews...
      </p>
    </section>
  )
}
