"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EditAPI() {
  const [apis, setApis] = useState([]);
  const [selectedApiId, setSelectedApiId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch all APIs from the database
  useEffect(() => {
    async function fetchAPIs() {
      try {
        const response = await axios.get("/api/apis");
        setApis(response.data);
      } catch (error) {
        console.error("❌ Error fetching APIs:", error);
      }
    }
    fetchAPIs();
  }, []);

  // ✅ Fetch API details when an API is selected
  const handleApiSelect = async (apiId) => {
    setSelectedApiId(apiId);
    setLoading(true);
    try {
      const response = await axios.get(`/api/apis?id=${apiId}`);
      setFormData(response.data);
    } catch (error) {
      console.error("❌ Error fetching API details:", error);
    }
    setLoading(false);
  };

  // ✅ Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle array field updates
  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // ✅ Add a new field in array fields
  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { name: "", type: "", description: "" }],
    }));
  };

  // ✅ Remove a field from array fields
  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // ✅ Handle API update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put("/api/apis", formData);
      setMessage("✅ API updated successfully!");
    } catch (error) {
      console.error("❌ Error updating API:", error);
      setMessage("❌ Failed to update API.");
    }
    setSaving(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit API</h1>

      {/* ✅ API Selection Dropdown */}
      <label className="block text-lg font-semibold">Select API to Edit:</label>
      <select
        value={selectedApiId || ""}
        onChange={(e) => handleApiSelect(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      >
        <option value="">-- Select an API --</option>
        {apis.map((api) => (
          <option key={api.id} value={api.id}>
            {api.name} ({api.method} {api.endpoint})
          </option>
        ))}
      </select>

      {/* ✅ Show Loading Indicator */}
      {loading && <p className="text-blue-500">Loading API details...</p>}

      {/* ✅ Edit Form (Big Ass Form) */}
      {formData && (
        <form onSubmit={handleUpdate} className="bg-white p-6 shadow rounded">
          {message && <p className="mb-4">{message}</p>}

          {/* ✅ Basic API Info */}
          <label className="block text-sm font-medium">API Name</label>
          <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full p-2 border rounded mb-4" required />

          <label className="block text-sm font-medium">Endpoint</label>
          <input type="text" value={formData.endpoint} onChange={(e) => handleInputChange("endpoint", e.target.value)} className="w-full p-2 border rounded mb-4" required />

          {/* ✅ Headers, Query Params, Request Body */}
          {["headers", "query_params", "request_body", "response_body", "response_codes"].map((field) => (
            <div key={field} className="mt-4">
              <h2 className="text-lg font-semibold">{field.replace(/_/g, " ")}</h2>
              {formData[field].map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Name" value={item.name} onChange={(e) => handleArrayChange(field, index, "name", e.target.value)} className="w-1/3 p-2 border rounded" />
                  <input type="text" placeholder="Type" value={item.type} onChange={(e) => handleArrayChange(field, index, "type", e.target.value)} className="w-1/3 p-2 border rounded" />
                  <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleArrayChange(field, index, "description", e.target.value)} className="w-1/3 p-2 border rounded" />
                  <button type="button" onClick={() => removeArrayField(field, index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayField(field)} className="text-blue-500">+ Add {field.replace(/_/g, " ")}</button>
            </div>
          ))}

          {/* ✅ JSON Fields */}
          <label className="block text-sm font-medium mt-4">Request Example (JSON)</label>
          <textarea value={formData.request_example || ""} onChange={(e) => handleInputChange("request_example", e.target.value)} className="w-full p-2 border rounded h-40 font-mono" placeholder="Paste JSON here..." />

          <label className="block text-sm font-medium mt-4">Response Example (JSON)</label>
          <textarea value={formData.response_example || ""} onChange={(e) => handleInputChange("response_example", e.target.value)} className="w-full p-2 border rounded h-40 font-mono" placeholder="Paste JSON here..." />

          <label className="block text-sm font-medium mt-4">cURL Example</label>
          <textarea value={formData.curl_example || ""} onChange={(e) => handleInputChange("curl_example", e.target.value)} className="w-full p-2 border rounded h-40 font-mono" placeholder="Paste cURL command here..." />

          {/* ✅ Submit Button */}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded mt-6" disabled={saving}>
            {saving ? "Saving..." : "Update API"}
          </button>
        </form>
      )}
    </div>
  );
}
