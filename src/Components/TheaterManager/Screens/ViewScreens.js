import React from "react";

import Navbar from "../Home/Navbar";
import ScreenCard from './ScreenCard' 

function ViewScreens() {

  

  return (
    <div className="flex h-screen overflow-hidden">
    <Navbar />
    <div className="flex-grow ml-64">
      <ScreenCard />
    </div>
  </div>
  );
}

export default ViewScreens;
