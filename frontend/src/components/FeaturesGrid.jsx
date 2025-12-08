import React from 'react'

const FeaturesGrid = () => {
  return (
    <section className="bg-white-500 rounded-2xl p-8">
        <div>
          <p className="flex items-center justify-center text-stone-600 font-semibold">Academics and Professionals from Top Institutions use Paperguide for Research</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="max-w-81 h-auto bg-white flex items-center justify-center">
            <img alt="Who trusts us" loading="lazy" width="3120" height="216" decoding="async" data-nimg="1" className="object-contain grayscale hidden sm:block" style={{ color: "transparent" }} src="/brands_image.png" />
          </div>
        </div>
    </section>
  )
}

export default FeaturesGrid
