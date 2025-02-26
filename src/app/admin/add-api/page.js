"use client";

import { useState, useEffect } from "react";

export default function AddEditAPI() {
  const [categories, setCategories] = useState([]);
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "POST",
    categoryId: "",
    requiresAuth: false,
    description: "",
  });

  // Fetch Categories & APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch("/api/categories");
        const apisRes = await fetch("/api/apis");

        setCategories(await categoriesRes.json());
        setApis(await apisRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Populate Form when selecting API for Editing
  const handleSelectApi = (apiId) => {
    const api = apis.find((a) => a.id === apiId);
    if (api) {
      setSelectedApi(api);
      setFormData(api);
    }
  };

  // Submit Form (Create or Update API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = selectedApi ? "PUT" : "POST";
    const url = "/api/apis";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedApi ? { ...formData, id: selectedApi.id } : formData),
      });

      if (res.ok) {
        alert(`API ${selectedApi ? "Updated" : "Created"} Successfully!`);
        setFormData({
          name: "",
          endpoint: "",
          method: "POST",
          categoryId: "",
          requiresAuth: false,
          description: "",
        });
        setSelectedApi(null);
      } else {
        alert("Error saving API.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save API.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Add / Edit API</h1>

      {/* API Search & Selection */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search APIs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded"
        />
        <select
          onChange={(e) => handleSelectApi(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded mt-3"
        >
          <option value="">Select API to Edit</option>
          {apis
            .filter((api) => api.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((api) => (
              <option key={api.id} value={api.id}>
                {api.name}
              </option>
            ))}
        </select>
      </div>

      {/* API Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-2 font-medium">API Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Endpoint</label>
            <input
              type="text"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Method</label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
            >
              {["GET", "POST", "PUT", "DELETE"].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
        {selectedApi ? "Update API" : "Create API"}
      </button>
    </div>
  );
}
