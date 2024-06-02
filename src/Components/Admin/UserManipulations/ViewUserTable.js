import React, { useState, useEffect } from "react";
import axios from "axios";

function ViewUserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL; 
        const response = await axios.get(
          `${baseUrl}/admin/fetchUsers`
        );
        const { usersData } = response.data;
        setUsers(usersData);
        console.log(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId, currentStatus) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.patch(
        `${baseUrl}/admin/blockUser/${userId}`,
        { blockUser: !currentStatus }
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

  return (
    <div className="flex-grow p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">View Users</h1>
      <div className="overflow-x-auto">
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
                  {user.firstName ? user.firstName : "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.lastName ? user.lastName : "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.email ? user.email : "Nil"}
                </td>
                <td className="py-2 px-4 border-b">
                  {user.mobileNumber ? user.mobileNumber : "Nil"}
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
    </div>
  );
}

export default ViewUserTable;
