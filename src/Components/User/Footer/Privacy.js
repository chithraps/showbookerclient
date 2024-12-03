import React from "react";
import Header from '../LandingPage/Header' 

const Privacy = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6 md:p-10 m-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            At <span className="font-semibold">ShowBooker</span>, we are committed to protecting your
            privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal
            information.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">Information We Collect</h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            - Personal details such as your name, email, and contact information when you sign up.
            <br />
            - Payment information for ticket bookings.
            <br />
            - Data about your interactions with our platform to enhance your experience.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">How We Use Your Data</h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            Your data is used to:
            <ul className="list-disc pl-5 mt-2">
              <li>Provide seamless booking experiences.</li>
              <li>Improve our services and offerings.</li>
              <li>Send updates and promotional materials.</li>
            </ul>
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            Protecting Your Information
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            We use secure systems and encryption to protect your personal and payment data.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            Updates to This Policy
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            This policy may be updated from time to time. Please review it regularly to stay
            informed.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
