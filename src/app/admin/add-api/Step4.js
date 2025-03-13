import axios from "axios";
import { useState } from "react";

export default function Step4({ formData, setFormData, prevStep, resetForm }) {
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      // ✅ Validate JSON fields before submission
      JSON.parse(formData.request_example || "{}");
      JSON.parse(formData.response_example || "{}");

      await axios.post("/api/apis", formData);
      alert("✅ API added successfully!");
      resetForm();
    } catch (error) {
      console.error("❌ Error adding API:", error);
      setError("❌ Invalid JSON format. Please check your examples.");
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Review & Submit API</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* ✅ Example Request Body */}
      <h3 className="text-lg font-semibold mt-4">Example Request Body</h3>
      <textarea
        value={formData.request_example || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, request_example: e.target.value }))}
        className="w-full p-2 border rounded h-40 font-mono"
        placeholder='Paste raw JSON payload here...'
      />

      {/* ✅ Example Response Body */}
      <h3 className="text-lg font-semibold mt-4">Example Response Body</h3>
      <textarea
        value={formData.response_example || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, response_example: e.target.value }))}
        className="w-full p-2 border rounded h-40 font-mono"
        placeholder='Paste raw JSON payload here...'
      />

      {/* ✅ cURL Example */}
      <h3 className="text-lg font-semibold mt-4">cURL Integration Example</h3>
      <textarea
        value={formData.curl_example || ""}
        onChange={(e) => setFormData((prev) => ({ ...prev, curl_example: e.target.value }))}
        className="w-full p-2 border rounded h-40 font-mono"
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
