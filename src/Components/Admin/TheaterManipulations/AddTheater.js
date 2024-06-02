import React, { useState } from "react";
import Navbar from "../Dashboard/Navbar";
import axios from "axios";
function AddTheater() {
  const [theaterDetails, setTheaterDetails] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
  });
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [responseMessage, setResponseMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheaterDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/admin/addTheater`,
        theaterDetails
      );
      console.log(theaterDetails)
      if (response.data.success) {
        setResponseMessage(response.data.message)
        setTheaterDetails({
          name: "",
          location: "",
          city: "",
          state: "",
        });
      } else {
        setResponseMessage(response.data.message)
      }
    } catch (error) {
      console.error('Error adding theater:', error);
    }
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Add Theater</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={theaterDetails.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={theaterDetails.location}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="city"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={theaterDetails.city}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="state"
              >
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={theaterDetails.state}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
            {responseMessage && ( // Conditionally render response message
              <div className="mt-4 text-center">
                <p className={responseMessage === "Theater added successfully!" ? "text-green-500" : "text-red-500"}>{responseMessage}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTheater;
