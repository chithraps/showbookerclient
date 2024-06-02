import React from 'react'
import Navbar from './Navbar'

function TMDashbord() {
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex-1 p-4">
        {/* Add your main content here */}
        <h1>Welcome to the Theater Manager Dashboard</h1>
      </div>
    </div>
  )
}

export default TMDashbord