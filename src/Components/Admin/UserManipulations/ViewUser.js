import React from 'react';
import Navbar from '../Dashboard/Navbar';
import ViewUserTable from './ViewUserTable';

function ViewUser() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <div className="flex-grow ml-64">
        <ViewUserTable />
      </div>
    </div>
  );
}

export default ViewUser;
