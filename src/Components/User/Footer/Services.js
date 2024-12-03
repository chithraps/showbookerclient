import React from "react";
import Header from '../LandingPage/Header'

const Services = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6 md:p-10 m-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
            Our Services
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            At <span className="font-semibold">ShowBooker</span>, we offer a seamless movie booking
            experience. Our services include:
          </p>
          <ul className="list-disc pl-5 mt-4 text-gray-600 text-lg leading-relaxed">
            <li>**Browse Movies**: Explore the latest movies and showtimes.</li>
            <li>**Select Seats**: Choose your preferred seats in the theater.</li>
            <li>**Secure Payment**: Complete bookings with secure payment options.</li>
            <li>**Booking History**: Access and manage your past bookings.</li>
          </ul>
          <p className="text-gray-600 text-lg leading-relaxed text-justify mt-4">
            Experience the convenience of booking your favorite movies with just a few clicks.
          </p>
        </div>
      </div>
    </>
  );
};

export default Services;
