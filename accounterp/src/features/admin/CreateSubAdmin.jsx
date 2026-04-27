import React, { useState } from "react";
import api from "../../utils/api";

export default function CreateSubAdminSimple() {
  const [email, setEmail] = useState("");

  const [permissions, setPermissions] = useState({
    Getallcounslour: false,
    canDeleteUsers: false,
    canViewReports: false,
    canAssignCounsellor: false,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePermission = (key) => {
    setPermissions({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/subadmin/create", {
        email,
        permissions,
      });

      setMsg(res.data.message || "SubAdmin created");
      setEmail("");
      setPermissions({
        canManageUsers: false,
        canDeleteUsers: false,
        canViewReports: false,
        canAssignCounsellor: false,
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-5 shadow rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4">Create SubAdmin</h2>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Enter email"
        className="border w-full p-2 mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PERMISSIONS */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Permissions</p>

        {Object.keys(permissions).map((key) => (
          <label key={key} className="block text-sm">
            <input
              type="checkbox"
              checked={permissions[key]}
              onChange={() => handlePermission(key)}
            />{" "}
            {key}
          </label>
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Create SubAdmin"}
      </button>

      {/* MESSAGE */}
      {msg && (
        <p className="text-center mt-3 text-sm text-green-600">{msg}</p>
      )}
    </div>
  );
}