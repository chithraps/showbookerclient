import React from 'react';
import Header from '../LandingPage/Header'

function AboutUs() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6 md:p-10 m-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
            About Us
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            Welcome to <span className="font-semibold">ShowBooker</span>! We aim to make your movie
            booking experience seamless and enjoyable. With ShowBooker, you can explore theaters,
            browse movies, and book tickets effortlessly, all from the comfort of your home.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed text-justify mt-4">
            Our mission is to provide a user-friendly platform that connects movie lovers with the
            best cinema experiences. Thank you for choosing us for your entertainment needs!
          </p>
        </div>
      </div>
    </>
  )
}

export default AboutUs