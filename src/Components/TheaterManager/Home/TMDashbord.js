import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import LineChart from "./LineChart";
import { logoutTM } from '../../../Features/TheaterAdminActions';
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";


function TMDashbord() {
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const theater_id = theaterAdmin?.theaterAdmin?.theaterId;
  const token = theaterAdmin?.theaterAdminAccessToken;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/tmAdmin/getDetails`, {
          params: { theaterId: theater_id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.data?.message === "Unauthorized: Token has expired") {
          swal({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutTM());
              navigate("/theaterAdmin");
            }
          });
        }
      }
    };

    if (theater_id && token) {
      fetchDashboardData();
    }
  }, [theater_id, token]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64 p-2 space-y-6">
        <header className="flex justify-between items-center bg-white p-3 ">
          <h1 className="text-3xl font-bold text-gray-800">
            {" "}
            Theater Admin Dashboard
          </h1>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="p-3 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Bookings
            </h2>
            <p className="text-2xl font-bold text-blue-600">
              {dashboardData.totalBookings}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
            <p className="text-2xl font-bold text-green-500 flex items-center">
              <MdCurrencyRupee />
              {dashboardData.totalRevenue}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg shadow-lg flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-700">
              Active Shows
            </h2>
            <p className="text-2xl font-bold text-indigo-600">
              {dashboardData.activeShows}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-3 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Booking Trends
          </h2>
          <div className="h-64 z-0">
           <LineChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TMDashbord;
