"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/schemas"; // API Route

export default function ManageSchemas() {
  const [schemas, setSchemas] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headers: [],
    queryParams: [],
    requestBody: [],
    responseBody: [],
    responseCodes: [],
  });
  const [editId, setEditId] = useState(null);

  // ✅ Fetch all schemas
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
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  // ✅ Handle input changes for array fields
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedField = [...formData[field]];
    updatedField[index][key] = value;
    setFormData((prevState) => ({ ...prevState, [field]: updatedField }));
  };

  // ✅ Add a new field to array fields
  const addArrayField = (field) => {
    const newField =
      field === "responseCodes"
        ? { code: "", description: "" }
        : { name: "", type: "", description: "" };

    setFormData((prevState) => ({
      ...prevState,
      [field]: [...prevState[field], newField],
    }));
  };

  // ✅ Remove a field from array fields
  const removeArrayField = (field, index) => {
    const updatedField = formData[field].filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, [field]: updatedField }));
  };

  // ✅ Fetch specific schema by ID for editing
  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${API_URL}?id=${id}`);
      const schemaData = response.data;

      setFormData({
        name: schemaData.name || "",
        description: schemaData.description || "",
        headers: schemaData.headers || [],
        queryParams: schemaData.query_params || [],
        requestBody: schemaData.request_body || [],
        responseBody: schemaData.response_body || [],
        responseCodes: schemaData.response_codes || [],
      });

      setEditId(id);
    } catch (error) {
      console.error("❌ Error fetching schema:", error);
      alert("❌ Failed to load schema.");
    }
  };

  // ✅ Add a new schema
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, formData);
      alert("✅ Schema Added Successfully!");
      fetchSchemas();
      resetForm();
    } catch (error) {
      console.error("❌ Error adding schema:", error);
      alert("❌ Failed to add schema.");
    }
  };

  // ✅ Update existing schema
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editId) return alert("❌ No schema selected for editing.");

    try {
      await axios.put(API_URL, { id: editId, ...formData });
      alert("✅ Schema Updated Successfully!");
      fetchSchemas();
      resetForm();
    } catch (error) {
      console.error("❌ Error updating schema:", error);
      alert("❌ Failed to update schema.");
    }
  };

  // ✅ Delete Schema
  const handleDelete = async (id) => {
    if (!confirm("⚠ Are you sure you want to delete this schema?")) return;

    try {
      await axios.delete(API_URL, { data: { id } });
      alert("✅ Schema Deleted Successfully!");
      fetchSchemas();
    } catch (error) {
      console.error("❌ Error deleting schema:", error);
      alert("❌ Failed to delete schema.");
    }
  };

  // ✅ Reset Form for adding a new schema
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      headers: [],
      queryParams: [],
      requestBody: [],
      responseBody: [],
      responseCodes: [],
    });
    setEditId(null);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{editId ? "Edit Schema" : "Define Schema"}</h1>
        <button onClick={resetForm} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add New Schema
        </button>
      </div>

      {/* ✅ Schema Form */}
      <form onSubmit={editId ? handleUpdate : handleSubmit} className="grid gap-6 bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">{editId ? "Edit Schema" : "Add New Schema"}</h2>
        <div>
          <label className="block text-sm font-medium">Schema Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            rows="3"
          />
        </div>

        {/* ✅ Dynamic Fields for API Schema */}
        {["headers", "queryParams", "requestBody", "responseBody", "responseCodes"].map((field) => (
          <div key={field}>
            <h2 className="text-lg font-semibold capitalize">{field.replace(/([A-Z])/g, " $1")}</h2>
            {formData[field]?.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="Name" value={item.name || ""} onChange={(e) => handleArrayFieldChange(field, index, "name", e.target.value)} className="w-1/3 p-2 border rounded dark:bg-gray-700" />
                <input type="text" placeholder="Type" value={item.type || ""} onChange={(e) => handleArrayFieldChange(field, index, "type", e.target.value)} className="w-1/3 p-2 border rounded dark:bg-gray-700" />
                <input type="text" placeholder="Description" value={item.type || ""} onChange={(e) => handleArrayFieldChange(field, index, "description", e.target.value)} className="w-1/3 p-2 border rounded dark:bg-gray-700" />
                <button type="button" onClick={() => removeArrayField(field, index)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField(field)} className="text-blue-500">Add {field.replace(/([A-Z])/g, " $1")}</button>
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
          {editId ? "Update Schema" : "Add Schema"}
        </button>
      </form>

      {/* ✅ List of Schemas */}
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schemas.map((schema) => (
            <tr key={schema.id}>
              <td className="p-2">{schema.name}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(schema.id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(schema.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
