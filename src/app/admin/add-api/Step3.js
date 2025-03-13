import { useEffect, useState } from "react";
import axios from "axios";

export default function Step3({ formData, setFormData, nextStep, prevStep }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (formData.schema_id) {
      fetchSchemaDetails(formData.schema_id);
    }
  }, [formData.schema_id]);

  const fetchSchemaDetails = async (schemaId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/schemas?id=${schemaId}`);
      const schema = response.data;

      setFormData((prev) => ({
        ...prev,
        request_body: schema.request_body || [],
        response_body: schema.response_body || [],
        response_codes: schema.response_codes || [],
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
      <h2 className="text-xl font-bold mb-4">Request & Response Body + Response Codes</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <p className="text-blue-500 text-sm">Loading schema details...</p>}

      {/* ✅ Request Body */}
      <h3 className="text-lg font-semibold mt-4">Request Body</h3>
      {formData.request_body.map((field, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={field.name}
            onChange={(e) => handleFieldChange("request_body", index, "name", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={field.type}
            onChange={(e) => handleFieldChange("request_body", index, "type", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={field.description}
            onChange={(e) => handleFieldChange("request_body", index, "description", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("request_body", index)} className="text-red-500 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("request_body")} className="text-blue-500 text-sm mt-2">+ Add Request Body Field</button>

      {/* ✅ Response Body */}
      <h3 className="text-lg font-semibold mt-6">Response Body</h3>
      {formData.response_body.map((field, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={field.name}
            onChange={(e) => handleFieldChange("response_body", index, "name", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={field.type}
            onChange={(e) => handleFieldChange("response_body", index, "type", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={field.description}
            onChange={(e) => handleFieldChange("response_body", index, "description", e.target.value)}
            className="w-full sm:w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("response_body", index)} className="text-red-500 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("response_body")} className="text-blue-500 text-sm mt-2">+ Add Response Body Field</button>

      {/* ✅ Response Codes */}
      <h3 className="text-lg font-semibold mt-6">Response Codes</h3>
      {formData.response_codes.map((code, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Code"
            value={code.name}
            onChange={(e) => handleFieldChange("response_codes", index, "name", e.target.value)}
            className="w-full sm:w-1/4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={code.type}
            onChange={(e) => handleFieldChange("response_codes", index, "type", e.target.value)}
            className="w-full sm:w-1/4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={code.description}
            onChange={(e) => handleFieldChange("response_codes", index, "description", e.target.value)}
            className="w-full sm:w-1/2 p-2 border rounded"
          />
          <button onClick={() => removeField("response_codes", index)} className="text-red-500 text-sm">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("response_codes")} className="text-blue-500 text-sm mt-2">+ Add Response Code</button>

      {/* ✅ Navigation Buttons */}
      <div className="mt-4 flex justify-between">
        <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
