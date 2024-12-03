import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Dashboard/Navbar";
import { useSelector } from "react-redux";
function AddTheaterManager() {
  const [email, setEmail] = useState("");
  const [theaterName, setTheaterName] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin.adminAccessToken;
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/viewTheaters`, {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        console.log(response.data);

        setTheaters(response.data.theaters);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      }
    };

    fetchTheaters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/admin/addTheaterManager`,
        {
          email,
          theaterName,
        },
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      if (response.status === 201) {
        setResponseMessage(response.data.message);
        setEmail("");
        setTheaterName("");
      } else {
        setResponseMessage("Failed to create theater manager");
      }
    } catch (error) {
      console.error("Error creating theater manager:", error);
      setResponseMessage("Error creating theater manager");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Add Theater Manager
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="theaterName"
              >
                Theater Name
              </label>
              <select
                value={theaterName}
                onChange={(e) => setTheaterName(e.target.value)}
                className="w-full py-2 px-3 border rounded"
                required
              >
                <option value="">Select Theater</option>
                {theaters.map((theater) => (
                  <option key={theater._id} value={theater.name}>
                    {theater.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
            {responseMessage && (
              <div className="mt-4 text-center">
                <p
                  className={
                    responseMessage === "Theater manager added successfully"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {responseMessage}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTheaterManager;
