import axios from "axios";
import { useState } from "react";

export default function Step4({ formData, setFormData, prevStep, resetForm }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Function to validate JSON format
  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async () => {
    // ✅ Validate JSON fields before submission
    if (!isValidJson(formData.request_example || "{}")) {
      setError("❌ Invalid JSON format in Request Example.");
      return;
    }
    if (!isValidJson(formData.response_example || "{}")) {
      setError("❌ Invalid JSON format in Response Example.");
      return;
    }

    try {
      await axios.post("/api/apis", formData);
      setSuccess("✅ API added successfully!");
      setError("");
      resetForm();
    } catch (error) {
      console.error("❌ Error adding API:", error);
      setError("❌ Failed to submit API.");
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Review & Submit API</h2>

      {/* ✅ Success/Error Messages */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      {/* ✅ Example Request Body */}
      <h3 className="text-lg font-semibold mt-4">Example Request Body</h3>
      <textarea
        value={formData.request_example || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, request_example: e.target.value }))}
        className="w-full p-2 border rounded h-32 font-mono"
        placeholder='Paste raw JSON payload here...'
      />

      {/* ✅ Live Preview (Only if JSON is valid) */}
      {isValidJson(formData.request_example) && (
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-2">
          {JSON.stringify(JSON.parse(formData.request_example || "{}"), null, 2)}
        </pre>
      )}

      {/* ✅ Example Response Body */}
      <h3 className="text-lg font-semibold mt-4">Example Response Body</h3>
      <textarea
        value={formData.response_example || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, response_example: e.target.value }))}
        className="w-full p-2 border rounded h-32 font-mono"
        placeholder='Paste raw JSON payload here...'
      />

      {/* ✅ Live Preview (Only if JSON is valid) */}
      {isValidJson(formData.response_example) && (
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-2">
          {JSON.stringify(JSON.parse(formData.response_example || "{}"), null, 2)}
        </pre>
      )}

      {/* ✅ cURL Example */}
      <h3 className="text-lg font-semibold mt-4">cURL Integration Example</h3>
      <textarea
        value={formData.curl_example || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, curl_example: e.target.value }))}
        className="w-full p-2 border rounded h-32 font-mono"
        placeholder='Paste cURL command here...'
      />

      {/* ✅ Submit Buttons */}
      <div className="mt-4 flex justify-between">
        <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Submit API</button>
      </div>
    </div>
  );
}
