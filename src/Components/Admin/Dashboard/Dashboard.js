import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import BookingsChart from "./BookingsChart";
import axios from 'axios';
import { useSelector } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import RevenueChart from "./RevenueChart";

function Dashboard() {
  const [statistics, setStatistics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeShows: 0,
  });
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin?.adminAccessToken;
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/statistics`,{
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        setStatistics(response.data);
        console.log("response ",response.data)
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStatistics();
  }, []);
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64 p-5 space-y-6">
        {/* Header Section */}
        <header className="flex justify-between items-center bg-white p-3 ">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Bookings
            </h2>
            <p className="text-2xl font-bold text-blue-600">{statistics.totalBookings}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
            <p className="text-2xl font-bold text-green-500 flex items-center"><MdCurrencyRupee />{statistics.totalRevenue}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
            <p className="text-2xl font-bold text-purple-600">{statistics.totalUsers}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">
              Active Shows
            </h2>
            <p className="text-2xl font-bold text-indigo-600">{statistics.activeShows}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Bookings Chart
            </h2>
            <BookingsChart />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Booking status
            </h2>
            <RevenueChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
