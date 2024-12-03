import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function ViewUserTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); 
  const [totalUsers, setTotalUsers] = useState(0);
  const admin = useSelector((state) => state.admin);
  console.log("admin and token ",admin.admin," ",admin.adminAccessToken);
  const adminAccessToken = admin.adminAccessToken;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/admin/fetchUsers`, 
          {
            params: { page, limit },
            headers: {
              Authorization: `Bearer ${adminAccessToken}` 
            }
          }
        );
        const { usersData, totalUsers } = response.data;
        setUsers(usersData);
        setTotalUsers(totalUsers);
        console.log(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [page, limit]); 

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.patch(
        `${baseUrl}/admin/blockUser/${userId}`,
        { blockUser: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}` 
          }
        }
  
      );
      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, blockUser: !currentStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="flex-grow p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">View Users</h1>
      <div className="overflow-x-auto h-96">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">First Name</th>
              <th className="py-2 px-4 border-b text-left">Last Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Mobile Number</th>
              <th className="py-2 px-4 border-b text-left">Phone Verified</th>
              <th className="py-2 px-4 border-b text-left">Email Verified</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Created At</th>
              <th className="py-2 px-4 border-b text-left">Updated At</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">
                  {user.firstName || "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.lastName || "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.email || "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.mobileNumber || "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.phoneVerified ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.emailVerified ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.blockUser ? "Blocked" : "Active"}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(user.updated_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleBlockUser(user._id, user.blockUser)}
                    className={`py-1 px-3 rounded ${
                      user.blockUser
                        ? "bg-green-500 hover:bg-green-700"
                        : "bg-red-500 hover:bg-red-700"
                    } text-white`}
                  >
                    {user.blockUser ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <span className="px-3 py-1">{`Page ${page} of ${totalPages}`}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ViewUserTable;
