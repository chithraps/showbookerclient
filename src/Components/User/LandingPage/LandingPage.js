import React from 'react'
import Header from './Header';
import Footer from '../Footer/Footer'

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">
      {/* Your main content goes here */}
    </div>
    <Footer />
  </div>
  )
}

export default LandingPage