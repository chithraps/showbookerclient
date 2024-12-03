import React from "react";
import Navbar from "../Dashboard/Navbar";
import BookingTable from "./BookingTable";

function Bookings() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <BookingTable />
      </div>
    </div>
  );
}

export default Bookings;
