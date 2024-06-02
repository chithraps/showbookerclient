import React from 'react';
import HomeHeader from '../HeaderAL/HomeHeader';
import Footer from '../Footer/Footer'

function UserHome() {
  return (
    <div className="flex flex-col min-h-screen">
    <HomeHeader />
    <div className="flex-grow">
      {/* Your main content goes here */}
    </div>
    <Footer />
    </div>
  )
}

export default UserHome