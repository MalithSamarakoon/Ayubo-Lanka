import { useEffect, useState } from "react";
import axios from "axios";

const URL = "http://localhost:5000/api/user/users";

function UserMgt() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
  };

  useEffect(() => {
    fetchHandler().then((data) => {
      // initialize approval state
      const usersWithApproval = data.users.map((user) => ({
        ...user,
        approved: user.approved || false, // default false if undefined
      }));
      setUsers(usersWithApproval);
    });
  }, []);

  // Handle checkbox change
  const handleApprovalChange = (userId, checked) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, approved: checked } : user
      )
    );
    // TODO: send approval update to backend
  };

  // Handle delete user
  const handleDelete = (userId) => {
    setUsers((prev) => prev.filter((user) => user._id !== userId));
    // TODO: send delete request to backend
  };

  // Handle update user (dummy example)
  const handleUpdate = (userId) => {
    alert(`Update user: ${userId}`);
    // TODO: implement update modal or inline editing
  };

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm) ||
      user.doctorLicenseNumber?.includes(searchTerm) ||
      user.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.productCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 p-10">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text drop-shadow-md">
        User Management
      </h1>

      {/* Search input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-2xl shadow-lg border border-white/20 bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 transition placeholder-gray-500"
        />
      </div>

      {/* Users table */}
      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl bg-white/60">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <tr>
              <th className="py-4 px-6 font-semibold">#</th>
              <th className="py-4 px-6 font-semibold">Name</th>
              <th className="py-4 px-6 font-semibold">Email</th>
              <th className="py-4 px-6 font-semibold">Role</th>
              <th className="py-4 px-6 font-semibold">Mobile</th>
              <th className="py-4 px-6 font-semibold">Doctor License</th>
              <th className="py-4 px-6 font-semibold">Specialization</th>
              <th className="py-4 px-6 font-semibold">Company Address</th>
              <th className="py-4 px-6 font-semibold">Product Category</th>
              <th className="py-4 px-6 font-semibold">Approve</th>
              <th className="py-4 px-6 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr
                key={user._id}
                className="hover:bg-emerald-100/40 transition border-b border-gray-200"
              >
                <td className="py-4 px-6">{i + 1}</td>
                <td className="py-4 px-6 font-medium">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-md ${
                      user.role === "admin"
                        ? "bg-purple-500 text-white"
                        : user.role === "supplier"
                        ? "bg-emerald-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">{user.mobile || "-"}</td>
                <td className="py-4 px-6">{user.doctorLicenseNumber || "-"}</td>
                <td className="py-4 px-6">{user.specialization || "-"}</td>
                <td className="py-4 px-6">{user.companyAddress || "-"}</td>
                <td className="py-4 px-6">{user.productCategory || "-"}</td>
                <td className="py-4 px-6">
                  {(user.role === "doctor" || user.role === "supplier") && (
                    <input
                      type="checkbox"
                      checked={user.approved}
                      onChange={(e) =>
                        handleApprovalChange(user._id, e.target.checked)
                      }
                      className="w-5 h-5 accent-emerald-500"
                    />
                  )}
                </td>
                <td className="py-4 px-6 flex space-x-3">
  <button
    onClick={() => handleUpdate(user._id)}
    className="flex items-center justify-center gap-2 mt-6 py-3 px-4 
            bg-gradient-to-r from-blue-400 to-blue-700 
            rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
  >
    Update
  </button>
  <button
    onClick={() => handleDelete(user._id)}
    className="flex items-center justify-center gap-2 mt-6 py-3 px-4 
            bg-gradient-to-r from-red-500 to-rose-600 
            rounded-xl shadow-lg text-white font-semibold hover:shadow-2xl transition"
  >
    Delete
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

export default UserMgt;
