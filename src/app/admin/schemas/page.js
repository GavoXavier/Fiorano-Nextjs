"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/schemas"; // Backend API Route

export default function ManageSchemas() {
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
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // Track if editing

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

  // ✅ Handle input changes for top-level fields
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle changes in dynamic array fields
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // ✅ Add a new field to dynamic arrays
  const addArrayField = (field) => {
    const newField = { name: "", type: "", description: "" };
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], newField] }));
  };

  // ✅ Remove a field from dynamic arrays
  const removeArrayField = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // ✅ Handle submitting new schema OR updating existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        // ✅ Update existing schema
        await axios.put(API_URL, { id: editId, ...formData });
        alert("✅ Schema Updated Successfully!");
      } else {
        // ✅ Add new schema
        await axios.post(API_URL, formData);
        alert("✅ Schema Added Successfully!");
      }

      fetchSchemas();
      resetForm();
    } catch (error) {
      console.error("❌ Error saving schema:", error);
      alert("❌ Failed to save schema.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load schema data into form for editing
  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${API_URL}?id=${id}`);
      const schemaData = response.data;

      setFormData({
        name: schemaData.name || "",
        description: schemaData.description || "",
        headers: schemaData.headers || [],
        query_params: schemaData.query_params || [],
        request_body: schemaData.request_body || [],
        response_body: schemaData.response_body || [],
        response_codes: schemaData.response_codes || [],
      });

      setEditId(id);
    } catch (error) {
      console.error("❌ Error fetching schema:", error);
      alert("❌ Failed to load schema.");
    }
  };

  // ✅ Delete Schema
  const handleDelete = async (id) => {
    if (!confirm("⚠ Are you sure you want to delete this schema?")) return;

    try {
      await axios.delete(API_URL, { data: { id } });
      alert("✅ Schema Deleted Successfully!");
      fetchSchemas();
      resetForm();
    } catch (error) {
      console.error("❌ Error deleting schema:", error);
      alert("❌ Failed to delete schema.");
    }
  };

  // ✅ Reset Form for new schema
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      headers: [],
      query_params: [],
      request_body: [],
      response_body: [],
      response_codes: [],
    });
    setEditId(null);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{editId ? "Edit Schema" : "Add New Schema"}</h1>
        <button onClick={resetForm} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {editId ? "Cancel Edit" : "Reset Form"}
        </button>
      </div>

      {/* ✅ Schema Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <div>
          <label className="block text-sm font-medium">Schema Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700"
            rows="3"
          />
        </div>

        {/* ✅ Dynamic Fields for API Schema */}
        {["headers", "query_params", "request_body", "response_body", "response_codes"].map((field) => (
          <div key={field}>
            <h2 className="text-lg font-semibold capitalize">{field.replace(/_/g, " ")}</h2>
            {formData[field].map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="Name" value={item.name || ""} onChange={(e) => handleArrayFieldChange(field, index, "name", e.target.value)} className="w-1/4 p-2 border rounded dark:bg-gray-700" />
                <input type="text" placeholder="Type" value={item.type || ""} onChange={(e) => handleArrayFieldChange(field, index, "type", e.target.value)} className="w-1/4 p-2 border rounded dark:bg-gray-700" />
                <input type="text" placeholder="Description" value={item.description || ""} onChange={(e) => handleArrayFieldChange(field, index, "description", e.target.value)} className="w-1/3 p-2 border rounded dark:bg-gray-700" />
                <button type="button" onClick={() => removeArrayField(field, index)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField(field)} className="text-blue-500">Add {field.replace(/_/g, " ")}</button>
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
          {loading ? "Saving..." : editId ? "Update Schema" : "Add Schema"}
        </button>
      </form>

      {/* ✅ Schema List */}
      <h2 className="text-xl font-bold mb-4">List of Schemas</h2>
      <table className="w-full bg-white dark:bg-gray-800 border-collapse shadow-lg">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemas.map((schema) => (
            <tr key={schema.id} className="border-t dark:border-gray-700">
              <td className="p-3">{schema.name}</td>
              <td className="p-3">
                <button onClick={() => handleEdit(schema.id)} className="text-blue-500 mr-3">Edit</button>
                <button onClick={() => handleDelete(schema.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
