import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import axios from 'axios';
import { useSelector } from "react-redux";


ChartJS.register(ArcElement, Tooltip, Legend);

function RevenueChart() {
  const [statusCounts, setStatusCounts] = useState({
    Confirmed: 0,
    Pending: 0,
    Canceled: 0,
    Expired: 0,
  }); 
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin?.adminAccessToken;

  useEffect(() => {
    const fetchBookingStatusCounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/bookings-status`,{
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        
        const bookings = response.data; 

        
        const counts = bookings.reduce(
          (acc, booking) => {
            acc[booking.status] = (acc[booking.status] || 0) + 1;
            return acc;
          },
          { Confirmed: 0, Pending: 0, Canceled: 0, Expired: 0 }
        );

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching booking status counts:", error);
      }
    };

    fetchBookingStatusCounts();
  }, []);

  const data = {
    labels: ['Confirmed', 'Pending', 'Canceled', 'Expired'],
    datasets: [
      {
        data: [
          statusCounts.Confirmed,
          statusCounts.Pending,
          statusCounts.Canceled,
          statusCounts.Expired,
        ],
        backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336', '#9E9E9E'],
        hoverBackgroundColor: ['#66BB6A', '#FFEE58', '#EF5350', '#BDBDBD'],
      },
    ],
  };

  return (
    <div className="bg-white w-full h-72">      
      <Doughnut data={data} />
    </div>
  );
} 

export default RevenueChart;
