import React from "react";
import MoviesTable from "./MoviesTable";
import Navbar from "../Dashboard/Navbar";
function ViewMovies() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <MoviesTable />
      </div>
    </div>
  );
}

export default ViewMovies;
