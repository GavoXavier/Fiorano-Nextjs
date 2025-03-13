export default function Step1({ formData, setFormData, categories, onNext }) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Step 1: API Details</h2>
  
        <input type="text" placeholder="API Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded mb-4" />
  
        <input type="text" placeholder="Endpoint" required value={formData.endpoint} onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })} className="w-full p-2 border rounded mb-4" />
  
        <select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} className="w-full p-2 border rounded mb-4">
          {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
  
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded mb-4"></textarea>
  
        <select required value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full p-2 border rounded mb-4">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
  
        <button onClick={onNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    );
  }
  