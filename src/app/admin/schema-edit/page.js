"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "/api/schemas"; // Backend API Route

export default function SchemaList() {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Fetch all schemas from the database
  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await axios.get(API_URL);
      setSchemas(response.data);
    } catch (error) {
      console.error("❌ Error fetching schemas:", error);
    }
  };

  // ✅ Handle Delete Schema
  const handleDelete = async (id) => {
    if (!confirm("⚠ Are you sure you want to delete this schema?")) return;
    setLoading(true);

    try {
      await axios.delete(API_URL, { data: { id } });
      alert("✅ Schema Deleted Successfully!");
      fetchSchemas();
    } catch (error) {
      console.error("❌ Error deleting schema:", error);
      alert("❌ Failed to delete schema.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigate to Edit Schema Page
  const handleEdit = (id) => {
    router.push(`/admin/schemas?id=${id}`); // Redirects to Schema Form page
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Schemas</h1>

      {/* ✅ Schema List Table */}
      <table className="w-full bg-white dark:bg-gray-800 border-collapse shadow-lg">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemas.length > 0 ? (
            schemas.map((schema) => (
              <tr key={schema.id} className="border-t dark:border-gray-700">
                <td className="p-3">{schema.name}</td>
                <td className="p-3">{schema.description}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(schema.id)}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(schema.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center">
                No schemas found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
