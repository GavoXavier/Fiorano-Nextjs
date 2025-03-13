// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// const SCHEMA_API = "/api/schemas";

// export default function Step2({ formData, setFormData, schemas, onPrevious, onNext }) {
//   const [loadingSchema, setLoadingSchema] = useState(false);

//   // ✅ Handle Schema Selection & Fetch Data
//   const handleSchemaSelect = async (schemaId) => {
//     if (!schemaId) return;
    
//     setLoadingSchema(true);

//     try {
//       const response = await axios.get(`${SCHEMA_API}?id=${schemaId}`);
//       const schemaData = response.data;

//       // ✅ Autofill fields with schema data
//       setFormData((prev) => ({
//         ...prev,
//         schema_id: schemaId,
//         headers: schemaData.headers || [],
//         query_params: schemaData.query_params || [],
//         request_body: schemaData.request_body || [],
//         response_body: schemaData.response_body || [],
//         response_codes: schemaData.response_codes || [],
//       }));
//     } catch (error) {
//       console.error("❌ Error fetching schema:", error);
//     } finally {
//       setLoadingSchema(false);
//     }
//   };

//   // ✅ Handle Dynamic Field Updates
//   const handleArrayFieldChange = (field, index, key, value) => {
//     const updatedArray = [...formData[field]];
//     updatedArray[index][key] = value;
//     setFormData((prev) => ({ ...prev, [field]: updatedArray }));
//   };

//   // ✅ Add New Dynamic Field
//   const addArrayField = (field) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: [...prev[field], { name: "", type: "", description: "" }],
//     }));
//   };

//   // ✅ Remove Dynamic Field
//   const removeArrayField = (field, index) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index),
//     }));
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Step 2: Schema & Dynamic Fields</h2>

//       {/* ✅ Schema Selection */}
//       <label className="block text-sm font-medium">Select Schema (Optional)</label>
//       <select
//         value={formData.schema_id}
//         onChange={(e) => handleSchemaSelect(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       >
//         <option value="">Select Schema</option>
//         {schemas.map((schema) => (
//           <option key={schema.id} value={schema.id}>{schema.name}</option>
//         ))}
//       </select>

//       {loadingSchema && <p className="text-gray-500 mb-4">Loading schema details...</p>}

//       {/* ✅ Dynamic Fields Sections */}
//       {["headers", "query_params", "request_body", "response_body", "response_codes"].map((field) => (
//         <div key={field} className="mb-6">
//           <h3 className="text-lg font-semibold mb-2 capitalize">{field.replace("_", " ")}</h3>

//           {formData[field].map((item, index) => (
//             <div key={index} className="flex space-x-2 mb-2">
//               <input type="text" placeholder="Name" value={item.name} onChange={(e) => handleArrayFieldChange(field, index, "name", e.target.value)} className="w-1/3 p-2 border rounded" />
//               <input type="text" placeholder="Type" value={item.type} onChange={(e) => handleArrayFieldChange(field, index, "type", e.target.value)} className="w-1/3 p-2 border rounded" />
//               <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleArrayFieldChange(field, index, "description", e.target.value)} className="w-1/3 p-2 border rounded" />
//               <button onClick={() => removeArrayField(field, index)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
//             </div>
//           ))}

//           <button onClick={() => addArrayField(field)} className="bg-blue-500 text-white px-3 py-2 rounded">Add {field.replace("_", " ")}</button>
//         </div>
//       ))}

//       <div className="mt-6">
//         <button onClick={onPrevious} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
//         <button onClick={onNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";

export default function Step2({ formData, setFormData, nextStep, prevStep }) {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/schemas")
      .then((res) => setSchemas(res.data))
      .catch((err) => console.error("❌ Error fetching schemas:", err));
  }, []);

  const handleSchemaChange = async (e) => {
    const schemaId = e.target.value;
    setFormData({ ...formData, schema_id: schemaId, headers: [], query_params: [] });

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
      <h2 className="text-xl font-bold mb-4">Select Schema & Define Headers & Query Params</h2>

      {/* Schema Selection Dropdown */}
      <label className="block text-lg font-semibold">Schema</label>
      <select name="schema_id" value={formData.schema_id} onChange={handleSchemaChange} className="w-full p-2 border rounded">
        <option value="">Select Schema</option>
        {schemas.map((schema) => (
          <option key={schema.id} value={schema.id}>{schema.name}</option>
        ))}
      </select>

      {loading && <p className="text-blue-500 mt-2">Loading schema details...</p>}

      {/* Headers */}
      <h3 className="text-lg font-semibold mt-6">Headers</h3>
      {formData.headers.map((header, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={header.name}
            onChange={(e) => handleFieldChange("headers", index, "name", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={header.type}
            onChange={(e) => handleFieldChange("headers", index, "type", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={header.description}
            onChange={(e) => handleFieldChange("headers", index, "description", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("headers", index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("headers")} className="mt-2 text-blue-500">+ Add Header</button>

      {/* Query Parameters */}
      <h3 className="text-lg font-semibold mt-6">Query Parameters</h3>
      {formData.query_params.map((param, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={param.name}
            onChange={(e) => handleFieldChange("query_params", index, "name", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type"
            value={param.type}
            onChange={(e) => handleFieldChange("query_params", index, "type", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={param.description}
            onChange={(e) => handleFieldChange("query_params", index, "description", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <button onClick={() => removeField("query_params", index)} className="text-red-500">Remove</button>
        </div>
      ))}
      <button onClick={() => addField("query_params")} className="mt-2 text-blue-500">+ Add Query Param</button>

      <div className="mt-4 flex justify-between">
        <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
        <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
