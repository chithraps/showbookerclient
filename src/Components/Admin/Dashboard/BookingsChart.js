import React, { useEffect, useState } from "react"; 
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useSelector } from "react-redux";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BookingsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], 
    datasets: [
      {
        label: "Total Bookings",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin?.adminAccessToken;
  

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        console.log("in fetch booking data ")
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/getMonthlyBookingdata`, {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });

        const data = response.data;

        if (data && Array.isArray(data)) {
          
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          
          const labels = data.map(item => `${months[item.month - 1]} ${item.year}`);
          const totalBookings = data.map(item => item.totalBookings);

          
          setChartData({
            labels,
            datasets: [
              {
                label: "Total Bookings",
                data: totalBookings,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
        } else {
          console.error("Invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, [adminAccessToken]);

  return (
    <div style={{ width: "500px", height: "300px" }}>     
      <Bar
        data={chartData}
        height={300}
        width={500}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0,
                font: {
                  size: 12, 
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BookingsChart;
