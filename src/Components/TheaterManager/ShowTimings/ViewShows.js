import React from 'react';
import Navbar from '../Home/Navbar';
import ViewShowsTable from '../ShowTimings/ViewShowsTable';

function ViewShows() {  
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <ViewShowsTable />
      </div>
    </div>
  )
}

export default ViewShows