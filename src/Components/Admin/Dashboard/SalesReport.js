import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useSelector,useDispatch } from "react-redux";
import { MdCurrencyRupee } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { logoutSuperAdmin } from "../../../Features/AdminActions";
import swal from "sweetalert";

function SalesReport() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin?.adminAccessToken;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/bookings`, {
          params: {
            status: statusFilter,
            page: currentPage,
            limit: itemsPerPage,
          },
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        setBookings(response.data.bookings);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (error.response?.data?.message === "Unauthorized: Token has expired") {
          swal({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutSuperAdmin());
              navigate("/admin");
            }
          });
        }
      }
    };

    fetchBookings();
  }, [statusFilter, currentPage]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 20);
    doc.autoTable({
      head: [
        [
          "User Email",
          "Movie",
          "Theater",
          "Show Date",
          "Show Time",
          "Seats",
          "Total Price",
          "Payment Status",
          "Booking Status",
        ],
      ],
      body: bookings.map((booking) => [
        booking.userEmail,
        booking.movieId?.title || "N/A",
        booking.theaterId?.name || "N/A",
        new Date(booking.showDate).toLocaleDateString(),
        booking.showTime,
        booking.seatIds
          .map((seat) => `${seat.seatId?.seat_number} (${seat.status})`)
          .join(", "),
        booking.totalPrice,
        booking.payment.status,
        booking.status,
      ]),
    });
    doc.save("SalesReport.pdf");
  };

  const downloadWord = () => {
    try {
      const doc = new Document({
        creator: "Sales Report System",
        title: "Sales Report",
        description: "Detailed sales report",
        sections: [
          {
            children: [
              new Paragraph({
                text: "Sales Report",
                heading: "Title",
                alignment: "center",
              }),
              new Table({
                rows: [
                  // Add a header row
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("User Email")],
                      }),
                      new TableCell({ children: [new Paragraph("Movie")] }),
                      new TableCell({ children: [new Paragraph("Theater")] }),
                      new TableCell({ children: [new Paragraph("Show Date")] }),
                      new TableCell({ children: [new Paragraph("Show Time")] }),
                      new TableCell({ children: [new Paragraph("Seats")] }),
                      new TableCell({
                        children: [new Paragraph("Total Price")],
                      }),
                      new TableCell({
                        children: [new Paragraph("Payment Status")],
                      }),
                      new TableCell({
                        children: [new Paragraph("Booking Status")],
                      }),
                    ],
                  }),
                  // Add rows dynamically from bookings
                  ...bookings.map(
                    (booking) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph(booking.userEmail || "N/A"),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(booking.movieId?.title || "N/A"),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(booking.theaterId?.name || "N/A"),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(
                                new Date(
                                  booking.showDate
                                ).toLocaleDateString() || "N/A"
                              ),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(booking.showTime || "N/A"),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(
                                booking.seatIds
                                  ? booking.seatIds
                                      .map(
                                        (seat) =>
                                          `${
                                            seat.seatId?.seat_number || "N/A"
                                          } (${seat.status || "N/A"})`
                                      )
                                      .join(", ")
                                  : "N/A"
                              ),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(`${booking.totalPrice || "N/A"}`),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph(booking.payment?.status || "N/A"),
                            ],
                          }),
                          new TableCell({
                            children: [new Paragraph(booking.status || "N/A")],
                          }),
                        ],
                      })
                  ),
                ],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "SalesReport.docx");
      });
    } catch (error) {
      console.error("Error generating Word document:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64 p-5 space-y-6">
        <div className="flex space-x-4 mb-6">
          <label htmlFor="statusFilter" className="mr-2">
            Filter by Booking Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
            <option value="Expired">Expired</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={downloadPDF}
          >
            Download as PDF
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={downloadWord}
          >
            Download as Word
          </button>
        </div>

        <div className="overflow-x-auto h-96">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">User Email</th>
                <th className="border px-4 py-2">Movie</th>
                <th className="border px-4 py-2">Theater</th>
                <th className="border px-4 py-2">Show Date</th>
                <th className="border px-4 py-2">Show Time</th>
                <th className="border px-4 py-2">Seats</th>
                <th className="border px-4 py-2">Total Price</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="border px-4 py-2">{booking.userEmail}</td>
                    <td className="border px-4 py-2">
                      {booking.movieId?.title}
                    </td>
                    <td className="border px-4 py-2">
                      {booking.theaterId?.name}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(booking.showDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{booking.showTime}</td>
                    <td className="border px-4 py-2">
                      {booking.seatIds.map((seat, index) => (
                        <div className="flex space-x-2" key={index}>
                          <span>{seat.seatId?.seat_number}</span>
                          <span>({seat.status})</span>
                        </div>
                      ))}
                    </td>
                    <td className="border px-4 py-2 flex items-center">
                      <MdCurrencyRupee />
                      {booking.totalPrice}
                    </td>
                    <td className="border px-4 py-2">
                      {booking.payment.status}
                    </td>
                    <td className="border px-4 py-2">{booking.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesReport;
