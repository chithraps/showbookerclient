import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, 
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useSelector } from "react-redux";


ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function LineChart() {
  const [chartData, setChartData] = useState(null);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const theater_id = theaterAdmin?.theaterAdmin?.theaterId;
  const token = theaterAdmin?.theaterAdminAccessToken;

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        console.log("theater id : ", theater_id);
        const response = await axios.get(`${baseUrl}/tmAdmin/bookingsChart`, {
          params: { theaterId: theater_id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const labels = response.data.map((item) => item._id);
        const data = response.data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Bookings Over Time",
              data,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [theater_id, token]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="p-3 bg-white rounded-lg shadow-lg w-full max-w-5xl mx-auto">
      
      <div className="h-52 md:h-48 z-0">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default LineChart;
