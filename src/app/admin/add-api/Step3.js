// "use client";

// import { useState } from "react";

// export default function Step3({ formData, setFormData, onPrevious, onSubmit, loading, resetForm }) {
//   const [showOverlay, setShowOverlay] = useState(false);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Step 3: Examples & Submit</h2>

//       {/* ✅ Example Request JSON */}
//       <label className="block text-sm font-medium mb-1">Example Request (JSON)</label>
//       <textarea placeholder="Enter example request JSON..." value={formData.request_example} onChange={(e) => setFormData({ ...formData, request_example: e.target.value })} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>

//       {/* ✅ Example Response JSON */}
//       <label className="block text-sm font-medium mb-1">Example Response (JSON)</label>
//       <textarea placeholder="Enter example response JSON..." value={formData.response_example} onChange={(e) => setFormData({ ...formData, response_example: e.target.value })} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>

//       {/* ✅ CURL Example */}
//       <label className="block text-sm font-medium mb-1">CURL Example</label>
//       <textarea placeholder="Enter CURL command..." value={formData.curl_example} onChange={(e) => setFormData({ ...formData, curl_example: e.target.value })} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>

//       {/* ✅ Navigation Buttons */}
//       <div className="mt-6">
//         <button onClick={onPrevious} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
//         <button onClick={() => setShowOverlay(true)} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
//       </div>

//       {/* ✅ Submission Confirmation Overlay */}
//       {showOverlay && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>

//             {/* ✅ Example Request */}
//             <h3 className="text-lg font-semibold">Example Request</h3>
//             <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded">{formData.request_example}</pre>

//             {/* ✅ Example Response */}
//             <h3 className="text-lg font-semibold">Example Response</h3>
//             <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded">{formData.response_example}</pre>

//             {/* ✅ CURL Example */}
//             <h3 className="text-lg font-semibold">CURL Example</h3>
//             <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded">{formData.curl_example}</pre>

//             {/* ✅ Confirmation Buttons */}
//             <div className="mt-6 flex justify-end space-x-2">
//               <button onClick={() => setShowOverlay(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
//               <button onClick={() => { onSubmit(); setShowOverlay(false); resetForm(); }} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//                 {loading ? "Submitting..." : "Confirm Submission"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";

export default function Step3({ formData, setFormData, nextStep, prevStep }) {
  const [loading, setLoading] = useState(false);

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
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Request & Response Body + Response Codes</h2>

      {loading && <p className="text-blue-500">Loading schema details...</p>}

      {/* Request Body */}
      <h3 className="text-lg font-semibold mt-4">Request Body</h3>
      {formData.request_body.map((field, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={field.name}
            onChange={(e) => handleFieldChange("request_body", index, "name", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={field.type}
            onChange={(e) => handleFieldChange("request_body", index, "type", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={field.description}
            onChange={(e) => handleFieldChange("request_body", index, "description", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("request_body", index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("request_body")} className="mt-2 text-blue-500">+ Add Request Body Field</button>

      {/* Response Body */}
      <h3 className="text-lg font-semibold mt-6">Response Body</h3>
      {formData.response_body.map((field, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={field.name}
            onChange={(e) => handleFieldChange("response_body", index, "name", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={field.type}
            onChange={(e) => handleFieldChange("response_body", index, "type", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={field.description}
            onChange={(e) => handleFieldChange("response_body", index, "description", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("response_body", index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("response_body")} className="mt-2 text-blue-500">+ Add Response Body Field</button>

      {/* Response Codes */}
      <h3 className="text-lg font-semibold mt-6">Response Codes</h3>
      {formData.response_codes.map((code, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={code.name}
            onChange={(e) => handleFieldChange("response_codes", index, "name", e.target.value)}
            className="w-1/4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={code.type}
            onChange={(e) => handleFieldChange("response_codes", index, "type", e.target.value)}
            className="w-1/4 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={code.description}
            onChange={(e) => handleFieldChange("response_codes", index, "description", e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
          <button onClick={() => removeField("response_codes", index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("response_codes")} className="mt-2 text-blue-500">+ Add Response Code</button>

      <div className="mt-4 flex justify-between">
        <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
