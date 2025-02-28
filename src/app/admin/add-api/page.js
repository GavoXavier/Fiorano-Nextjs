"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/apis"; // API Endpoint
const SCHEMA_URL = "/api/schemas"; // Schema Endpoint
const CATEGORY_URL = "/api/categories"; // Category Endpoint

export default function AddAPI() {
  const [categories, setCategories] = useState([]);
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRequestExample, setShowRequestExample] = useState(false);
  const [showResponseExample, setShowResponseExample] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    description: "",
    method: "POST",
    category_id: "",
    schema_id: "",
    requires_auth: false,
    headers: [],
    query_params: [],
    request_body: [],
    response_body: [],
    status_codes: [],
    example_request_body: "",
    example_response_body: "",
    example_curl_integration: "",
  });

  // ✅ Fetch Categories & Schemas
  useEffect(() => {
    fetchCategories();
    fetchSchemas();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  const fetchSchemas = async () => {
    try {
      const response = await axios.get(SCHEMA_URL);
      setSchemas(response.data);
    } catch (error) {
      console.error("❌ Error fetching schemas:", error);
    }
  };

  // ✅ Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle Schema Selection (Auto-fill Fields)
  const handleSchemaSelect = async (schemaId) => {
    try {
      const response = await axios.get(`${SCHEMA_URL}?id=${schemaId}`);
      const schema = response.data;

      setSelectedSchema(schema);
      setFormData((prev) => ({
        ...prev,
        schema_id: schema.id,
        headers: schema.headers || [],
        query_params: schema.query_params || [],
        request_body: schema.request_body || [],
        response_body: schema.response_body || [],
        status_codes: schema.response_codes || [],
        example_request_body: JSON.stringify(schema.example_request_body || {}, null, 2),
        example_response_body: JSON.stringify(schema.example_response_body || {}, null, 2),
      }));
    } catch (error) {
      console.error("❌ Error fetching schema:", error);
    }
  };

  // ✅ Handle Dynamic Fields Update
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index][key] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // ✅ Add new field to dynamic arrays
  const addArrayField = (field) => {
    const newField = { name: "", type: "", description: "" };
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], newField] }));
  };

  // ✅ Remove a field from dynamic arrays
  const removeArrayField = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  // ✅ Submit Form (Add API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        ...formData,
        headers: JSON.stringify(formData.headers),
        query_params: JSON.stringify(formData.query_params),
        request_body: JSON.stringify(formData.request_body),
        response_body: JSON.stringify(formData.response_body),
        status_codes: JSON.stringify(formData.status_codes),
      });

      if (response.status === 201) {
        alert("✅ API Added Successfully!");
        resetForm();
      } else {
        alert("❌ Failed to add API.");
      }
    } catch (error) {
      console.error("❌ Error adding API:", error);
      alert("❌ Error saving API.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      endpoint: "",
      description: "",
      method: "POST",
      category_id: "",
      schema_id: "",
      requires_auth: false,
      headers: [],
      query_params: [],
      request_body: [],
      response_body: [],
      status_codes: [],
      example_request_body: "",
      example_response_body: "",
      example_curl_integration: "",
    });
    setSelectedSchema(null);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold">Add New API</h1>

      {/* ✅ API Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
        {/* Basic Details */}
        <input type="text" placeholder="API Name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full p-3 border rounded dark:bg-gray-700" required />
        <input type="text" placeholder="Endpoint" value={formData.endpoint} onChange={(e) => handleInputChange("endpoint", e.target.value)} className="w-full p-3 border rounded dark:bg-gray-700" required />
        <textarea placeholder="Description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="w-full p-3 border rounded dark:bg-gray-700" rows="3" required />

        {/* Select Schema */}
        <select value={formData.schema_id} onChange={(e) => handleSchemaSelect(e.target.value)} className="w-full p-3 border rounded dark:bg-gray-700">
          <option value="">Choose Schema</option>
          {schemas.map((schema) => (
            <option key={schema.id} value={schema.id}>{schema.name}</option>
          ))}
        </select>

        {/* Example Fields */}
        <button type="button" onClick={() => setShowRequestExample(true)} className="text-blue-500">Add Request Example</button>
        {showRequestExample && <textarea placeholder="Example Request Body (JSON)" value={formData.example_request_body} onChange={(e) => handleInputChange("example_request_body", e.target.value)} className="w-full p-3 border rounded dark:bg-gray-700" rows="4" />}
        
        <button type="button" onClick={() => setShowResponseExample(true)} className="text-blue-500">Add Response Example</button>
        {showResponseExample && <textarea placeholder="Example Response Body (JSON)" value={formData.example_response_body} onChange={(e) => handleInputChange("example_response_body", e.target.value)} className="w-full p-3 border rounded dark:bg-gray-700" rows="4" />}

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">{loading ? "Saving..." : "Add API"}</button>
      </form>
    </div>
  );
}
