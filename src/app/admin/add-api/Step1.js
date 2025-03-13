// export default function Step1({ formData, setFormData, categories, onNext }) {
//     return (
//       <div>
//         <h2 className="text-xl font-bold mb-4">Step 1: API Details</h2>
  
//         <input type="text" placeholder="API Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded mb-4" />
  
//         <input type="text" placeholder="Endpoint" required value={formData.endpoint} onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })} className="w-full p-2 border rounded mb-4" />
  
//         <select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} className="w-full p-2 border rounded mb-4">
//           {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
//             <option key={method} value={method}>{method}</option>
//           ))}
//         </select>
  
//         <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded mb-4"></textarea>
  
//         <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full p-2 border rounded mb-4">
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
  
//         <button onClick={onNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
//       </div>
//     );
//   }
  


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
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Basic API Information</h2>

      <label>API Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <label>Endpoint URL</label>
      <input type="text" name="endpoint" value={formData.endpoint} onChange={handleChange} className="w-full p-2 border rounded" />
      {errors.endpoint && <p className="text-red-500">{errors.endpoint}</p>}

      <label>Category</label>
      <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded">
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      {errors.category_id && <p className="text-red-500">{errors.category_id}</p>}

      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Next</button>
    </div>
  );
}
