import { useState, useEffect } from "react";
import axios from "axios";
import { validateStep1 } from "./validation";

export default function Step1({ formData, setFormData, nextStep }) {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ Error fetching categories:", err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    const validationErrors = validateStep1(formData);
    if (Object.keys(validationErrors).length === 0) {
      if (typeof nextStep === "function") {
        nextStep();
      } else {
        console.error("❌ nextStep is not a function");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Basic API Information</h2>

      {/* ✅ API Name */}
      <label className="block text-sm font-medium">API Name</label>
      <input 
        type="text" 
        name="name" 
        value={formData.name} 
        onChange={handleChange} 
        className="w-full p-2 border rounded mb-2" 
        placeholder="Enter API Name"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      {/* ✅ Endpoint URL */}
      <label className="block text-sm font-medium mt-3">Endpoint URL</label>
      <input 
        type="text" 
        name="endpoint" 
        value={formData.endpoint} 
        onChange={handleChange} 
        className="w-full p-2 border rounded mb-2" 
        placeholder="Enter API Endpoint"
      />
      {errors.endpoint && <p className="text-red-500 text-sm">{errors.endpoint}</p>}

      {/* ✅ Method Dropdown */}
      <label className="block text-sm font-medium mt-3">HTTP Method</label>
      <select 
        name="method" 
        value={formData.method} 
        onChange={handleChange} 
        className="w-full p-2 border rounded mb-2"
      >
        {["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"].map((method) => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>
      {errors.method && <p className="text-red-500 text-sm">{errors.method}</p>}

      {/* ✅ API Description */}
      <label className="block text-sm font-medium mt-3">API Description</label>
      <textarea 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        className="w-full p-2 border rounded mb-2" 
        placeholder="Describe what this API does..."
      ></textarea>
      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

      {/* ✅ Category Selection */}
      <label className="block text-sm font-medium mt-3">Category</label>
      <select 
        name="category_id" 
        value={formData.category_id} 
        onChange={handleChange} 
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}

      {/* ✅ Next Button */}
      <button 
        onClick={handleNext} 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Next
      </button>
    </div>
  );
}
