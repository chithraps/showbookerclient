import React from "react";
import Navbar from "../Dashboard/Navbar";
import ViewTheatersTable from "./ViewTheatersTable";

function ViewTheaters() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <ViewTheatersTable />
      </div>
    </div>
  );
}

export default ViewTheaters;
