import { useState, useEffect } from "react";
import axios from "axios";

export default function Step2({ formData, setFormData, nextStep, prevStep }) {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/schemas")
      .then((res) => setSchemas(res.data))
      .catch((err) => {
        console.error("❌ Error fetching schemas:", err);
        setError("❌ Failed to load schemas.");
      });
  }, []);

  const handleSchemaChange = async (e) => {
    const schemaId = e.target.value;
    setFormData((prev) => ({ ...prev, schema_id: schemaId, headers: [], query_params: [] }));

    if (!schemaId) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/schemas?id=${schemaId}`);
      const schema = response.data;

      setFormData((prev) => ({
        ...prev,
        headers: schema.headers || [],
        query_params: schema.query_params || [],
      }));
    } catch (error) {
      console.error("❌ Error fetching schema details:", error);
      setError("❌ Failed to load schema details.");
    }
    setLoading(false);
  };

  const handleFieldChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { name: "", type: "", description: "" }],
    }));
  };

  const removeField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white p-6 shadow rounded max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Schema Selection & API Parameters</h2>

      {/* ✅ Schema Selection Dropdown */}
      <label className="block text-sm font-medium">Select Schema</label>
      <select 
        name="schema_id" 
        value={formData.schema_id} 
        onChange={handleSchemaChange} 
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select Schema</option>
        {schemas.map((schema) => (
          <option key={schema.id} value={schema.id}>{schema.name}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <p className="text-blue-500 text-sm">Loading schema details...</p>}

      {/* ✅ Headers */}
      <h3 className="text-lg font-semibold mt-4">Headers</h3>
      {formData.headers.map((header, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={header.name}
            onChange={(e) => handleFieldChange("headers", index, "name", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={header.type}
            onChange={(e) => handleFieldChange("headers", index, "type", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={header.description}
            onChange={(e) => handleFieldChange("headers", index, "description", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("headers", index)} className="text-red-500 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("headers")} className="text-blue-500 text-sm mt-2">+ Add Header</button>

      {/* ✅ Query Parameters */}
      <h3 className="text-lg font-semibold mt-4">Query Parameters</h3>
      {formData.query_params.map((param, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={param.name}
            onChange={(e) => handleFieldChange("query_params", index, "name", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={param.type}
            onChange={(e) => handleFieldChange("query_params", index, "type", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={param.description}
            onChange={(e) => handleFieldChange("query_params", index, "description", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("query_params", index)} className="text-red-500 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("query_params")} className="text-blue-500 text-sm mt-2">+ Add Query Param</button>

      {/* ✅ Navigation Buttons */}
      <div className="mt-4 flex justify-between">
        <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
