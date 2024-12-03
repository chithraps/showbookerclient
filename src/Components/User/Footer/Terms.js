import React from "react";
import Header from '../LandingPage/Header'

const Terms = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6 md:p-10 m-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            Welcome to <span className="font-semibold">ShowBooker</span>. By using our platform, you
            agree to the following terms and conditions. Please read them carefully before
            proceeding.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">1. General</h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            These terms govern your use of our platform and services. By accessing our website, you
            acknowledge that you have read and agreed to these terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            2. Booking Policy
          </h2>
          <ul className="list-disc pl-5 text-gray-600 text-lg leading-relaxed">
            <li>
            Users can cancel their bookings, but a cancellation fee will be deducted based on the
            time of cancellation and the applicable terms.
            </li>
            <li>
              Ensure that all details provided during the booking process are accurate.
            </li>
            
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            3. User Responsibilities
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            Users are responsible for maintaining the confidentiality of their account credentials
            and ensuring that any activity under their account complies with these terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            4. Liability
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            <span className="font-semibold">ShowBooker</span> is not liable for any issues arising
            from technical errors, payment gateway failures, or external factors affecting the
            service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            5. Amendments
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            We reserve the right to update these terms at any time without prior notice. Continued
            use of our platform constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">
            6. Contact Us
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            For any queries or concerns regarding these terms, please contact us at{" "}
            <a
              href="mailto:support@showbooker.com"
              className="text-blue-600 hover:underline"
            >
              support@showbooker.com
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Terms;
