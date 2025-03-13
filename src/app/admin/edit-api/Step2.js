"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const SCHEMA_API = "/api/schemas";

export default function Step2({ formData, setFormData, schemas, onPrevious, onNext }) {
  const [loadingSchema, setLoadingSchema] = useState(false);

  // ✅ Handle Schema Selection & Fetch Data
  const handleSchemaSelect = async (schemaId) => {
    if (!schemaId) return;
    
    setLoadingSchema(true);

    try {
      const response = await axios.get(`${SCHEMA_API}?id=${schemaId}`);
      const schemaData = response.data;

      // ✅ Autofill fields with schema data
      setFormData((prev) => ({
        ...prev,
        schema_id: schemaId,
        headers: schemaData.headers || [],
        query_params: schemaData.query_params || [],
        request_body: schemaData.request_body || [],
        response_body: schemaData.response_body || [],
        response_codes: schemaData.response_codes || [],
      }));
    } catch (error) {
      console.error("❌ Error fetching schema:", error);
    } finally {
      setLoadingSchema(false);
    }
  };

  // ✅ Handle Dynamic Field Updates
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // ✅ Add New Dynamic Field
  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { name: "", type: "", description: "" }],
    }));
  };

  // ✅ Remove Dynamic Field
  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 2: Schema & Dynamic Fields</h2>

      {/* ✅ Schema Selection */}
      <label className="block text-sm font-medium">Select Schema (Optional)</label>
      <select
        value={formData.schema_id}
        onChange={(e) => handleSchemaSelect(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select Schema</option>
        {schemas.map((schema) => (
          <option key={schema.id} value={schema.id}>{schema.name}</option>
        ))}
      </select>

      {loadingSchema && <p className="text-gray-500 mb-4">Loading schema details...</p>}

      {/* ✅ Dynamic Fields Sections */}
      {["headers", "query_params", "request_body", "response_body", "response_codes"].map((field) => (
        <div key={field} className="mb-6">
          <h3 className="text-lg font-semibold mb-2 capitalize">{field.replace("_", " ")}</h3>

          {formData[field].map((item, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input type="text" placeholder="Name" value={item.name} onChange={(e) => handleArrayFieldChange(field, index, "name", e.target.value)} className="w-1/3 p-2 border rounded" />
              <input type="text" placeholder="Type" value={item.type} onChange={(e) => handleArrayFieldChange(field, index, "type", e.target.value)} className="w-1/3 p-2 border rounded" />
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleArrayFieldChange(field, index, "description", e.target.value)} className="w-1/3 p-2 border rounded" />
              <button onClick={() => removeArrayField(field, index)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
            </div>
          ))}

          <button onClick={() => addArrayField(field)} className="bg-blue-500 text-white px-3 py-2 rounded">Add {field.replace("_", " ")}</button>
        </div>
      ))}

      <div className="mt-6">
        <button onClick={onPrevious} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
        <button onClick={onNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
