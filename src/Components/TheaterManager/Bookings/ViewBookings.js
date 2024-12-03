import React from "react";
import Navbar from "../Home/Navbar";
import BookingsTable from "./BookingsTable";

function ViewBookings() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <BookingsTable />
      </div>
    </div>
  );
}

export default ViewBookings;
