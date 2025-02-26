"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/schemas"; // Unified API Route

export default function EditSchema() {
  const [schemas, setSchemas] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headers: [],
    query_params: [],
    request_body: [],
    response_body: [],
    response_codes: [],
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`${API_URL}?id=${id}`);
      if (response.status === 200) {
        setFormData({
          name: response.data.name || "",
          description: response.data.description || "",
          headers: response.data.headers || [],
          query_params: response.data.query_params || [],
          request_body: response.data.request_body || [],
          response_body: response.data.response_body || [],
          response_codes: response.data.response_codes || [],
        });
        setEditId(id);
        setShowForm(true);
      } else {
        alert("❌ Schema not found.");
      }
    } catch (error) {
      console.error("❌ Error fetching schema:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Manage Schemas</h1>

      {/* ✅ Search Bar */}
      <input type="text" placeholder="Search Schemas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 w-full border rounded dark:bg-gray-700 mb-4" />

      {/* ✅ Schema List in Table Format */}
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemas.filter((schema) => schema.name.toLowerCase().includes(searchTerm.toLowerCase())).map((schema) => (
            <tr key={schema.id}>
              <td className="p-2">{schema.name}</td>
              <td className="p-2">{schema.description}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEditClick(schema.id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(schema.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Edit Schema</h2>
          <form>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700" required />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700" rows="3" required />
          </form>
        </div>
      )}
    </div>
  );
}
