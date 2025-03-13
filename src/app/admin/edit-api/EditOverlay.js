"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = "/api/apis"; // API route

export default function EditPage() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiId = searchParams.get("apiId");

  useEffect(() => {
    if (apiId) fetchApiDetails();
  }, [apiId]);

  const fetchApiDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${apiId}`);
      setFormData(response.data);
    } catch (error) {
      console.error("❌ Error fetching API details:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${apiId}`, formData);
      alert("✅ API Updated Successfully!");
      router.push("/admin/edit-api"); // Redirect back after update
    } catch (error) {
      console.error("❌ Error updating API:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p className="text-center">Loading API details...</p>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Edit API</h1>

      {/* ✅ All API Fields in One Long Form */}
      {Object.keys(formData).map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium">{field.replace("_", " ")}</label>
          <textarea value={formData[field] || ""} onChange={(e) => handleInputChange(field, e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700"></textarea>
        </div>
      ))}

      <div className="mt-6">
        <button onClick={() => router.push("/admin/edit-api")} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
        <button onClick={handleUpdate} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">{loading ? "Updating..." : "Update API"}</button>
      </div>
    </div>
  );
}
