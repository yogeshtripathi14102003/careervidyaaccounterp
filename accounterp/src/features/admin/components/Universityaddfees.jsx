"use client";

import React, { useEffect, useState } from "react";
import api from "../../../utils/api.js";
import * as XLSX from "xlsx";

export default function FeesAdminPanel() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    universityName: "",
    course: "",
    branch: "",
    session: "",
    totalFees: "",
    examFee: "",
    registrationFee: "",
    semesterFees: "",
  });

  // ✅ Fetch Data
  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/uni");
      setFees(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  // ✅ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Excel Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length > 0) {
        const row = jsonData[0];

        setForm({
          universityName: row.universityName || "",
          course: row.course || "",
          branch: row.branch || "",
          session: row.session || "",
          totalFees: row.totalFees || "",
          examFee: row.examFee || "",
          registrationFee: row.registrationFee || "",
          semesterFees: row.semesterFees
            ? JSON.stringify(row.semesterFees)
            : "",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // ✅ Create Fees
  const createFees = async () => {
    try {
      const payload = {
        ...form,
        semesterFees: form.semesterFees
          ? JSON.parse(form.semesterFees)
          : [],
      };

      await api.post("/uni", payload);
      fetchFees();

      // Reset form
      setForm({
        universityName: "",
        course: "",
        branch: "",
        session: "",
        totalFees: "",
        examFee: "",
        registrationFee: "",
        semesterFees: "",
      });
    } catch (err) {
      alert("Invalid JSON in Semester Fees");
    }
  };

  // ✅ Delete
  const deleteFees = async (id) => {
    try {
      await api.delete(`/uni/${id}`);
      fetchFees();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Set Current
  const setCurrent = async (id) => {
    try {
      await api.patch(`/fees/set-current/${id}`);
      fetchFees();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Create Admission Fees
          </h2>

          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="border p-2 w-full mb-4 rounded"
          />

          <div className="grid grid-cols-2 gap-3">
            <input name="universityName" placeholder="University" className="border p-2 rounded w-full" value={form.universityName} onChange={handleChange} />
            <input name="course" placeholder="Course" className="border p-2 rounded w-full" value={form.course} onChange={handleChange} />
            <input name="branch" placeholder="Branch" className="border p-2 rounded w-full" value={form.branch} onChange={handleChange} />
            <input name="session" placeholder="Session" className="border p-2 rounded w-full" value={form.session} onChange={handleChange} />
            <input name="totalFees" placeholder="Total Fees" className="border p-2 rounded w-full" value={form.totalFees} onChange={handleChange} />
            <input name="examFee" placeholder="Exam Fee" className="border p-2 rounded w-full" value={form.examFee} onChange={handleChange} />
            <input name="registrationFee" placeholder="Registration Fee" className="border p-2 rounded w-full col-span-2" value={form.registrationFee} onChange={handleChange} />
          </div>

          <textarea
            name="semesterFees"
            placeholder='Semester JSON (e.g. [{"sem":1,"fee":5000}])'
            className="border p-2 rounded w-full mt-3"
            value={form.semesterFees}
            onChange={handleChange}
          />

          <button
            onClick={createFees}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-semibold"
          >
            Create Fees
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Fees List
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">University</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{f.universityName}</td>
                      <td className="p-3">{f.course}</td>
                      <td className="p-3">{f.session}</td>
                      <td className="p-3">
                        {f.isCurrent ? (
                          <span className="text-green-600 font-semibold">
                            Current
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => setCurrent(f.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Set
                        </button>
                        <button
                          onClick={() => deleteFees(f.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}