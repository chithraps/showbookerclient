import React from "react";
import Navbar from "../Dashboard/Navbar";
import ViewGenresTable from "./ViewGenresTable";

function ViewGenre() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <ViewGenresTable />
      </div>
    </div>
  );
}

export default ViewGenre;
