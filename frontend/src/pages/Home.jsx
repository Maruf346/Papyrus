import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import FeaturesGrid from '../components/FeaturesGrid'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-stone-900">
            <Header />
            <main className="space-y-16 px-6 md:px-10 lg:px-20 xl:px-40 py-8">
                <Hero />

                <section className="max-w-4xl mx-auto text-center space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold">Built for researchers, by researchers</h2>
                    <p className="text-stone-600">Find papers, extract data, and write faster with AI-powered tools that keep your references and integrity intact.</p>
                    <div className="flex items-center justify-center gap-3">
                        <a className="bg-orange-10 text-white px-6 py-3 rounded-md font-semibold" href="/signup">Get started</a>
                        <a className="border border-stone-300 px-5 py-3 rounded-md text-stone-700" href="/pricing">See pricing</a>
                    </div>
                </section>

                <FeaturesGrid />

                <section className="bg-stone-50 rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-2xl font-bold">AI Search & Literature Review</h3>
                            <p className="text-stone-600">Ask questions, get research-backed answers, and generate structured summaries from the most relevant papers.</p>
                            <ul className="mt-4 space-y-2 text-sm text-stone-700">
                                <li>Question-based search</li>
                                <li>Automatic data extraction</li>
                                <li>Reference-aware document generation</li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="w-full h-56 bg-white border border-stone-200 rounded-lg flex items-center justify-center">
                                <span className="text-stone-400">Hero/preview image</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

