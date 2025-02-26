"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "/api/categories"; // Next.js API route

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  // ✅ Open Edit/Delete Modal
  const handleCategoryClick = (category) => {
    setName(category.name || ""); // ✅ Ensure no null values
    setDescription(category.description || ""); // ✅ Default to empty string
    setEditId(category.id);
    setShowModal(true);
  };

  // ✅ Open Add Category Modal
  const openAddCategoryModal = () => {
    setName("");
    setDescription("");
    setEditId(null);
    setAddCategoryModal(true);
  };

  // ✅ Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("❌ Name and Description are required!");
      return;
    }

    setLoading(true);
    const method = editId ? "PUT" : "POST";
    const payload = { name, description };

    if (editId) {
      payload.id = editId;
    }

    try {
      await axios({
        method,
        url: API_URL,
        data: payload,
        headers: { "Content-Type": "application/json" },
      });

      alert(`Category ${editId ? "Updated" : "Added"} Successfully!`);
      fetchCategories();
      setShowModal(false);
      setAddCategoryModal(false);
    } catch (error) {
      console.error("❌ Server error:", error.response?.data || error.message);
      alert("❌ Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Category
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    try {
      await axios.delete(API_URL, {
        data: { id: editId },
        headers: { "Content-Type": "application/json" },
      });

      alert("Category Deleted Successfully!");
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button onClick={openAddCategoryModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Category
        </button>
      </div>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search Categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-full border rounded dark:bg-gray-700 mb-4"
      />

      {/* ✅ Grid Layout for Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories
          .filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow text-center hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{category.description || "No description provided"}</p>
            </button>
          ))}
      </div>

      {/* ✅ Add Category Modal */}
      {addCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">Add New Category</h2>
            <button 
          onClick={() => setAddCategoryModal(false)} 
          className="text-gray-500 hover:text-red-500 text-lg font-bold">
          Close Modal
        </button>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 w-full border rounded dark:bg-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-2 w-full border rounded dark:bg-gray-700"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setAddCategoryModal(false)} className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                  {loading ? "Saving..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Edit/Delete Category Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">Edit Category</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 w-full border rounded dark:bg-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-2 w-full border rounded dark:bg-gray-700"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={handleDelete} disabled={loading} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                  {loading ? "Updating..." : "Update"}
                </button>
                <button 
          onClick={() => setAddCategoryModal(false)} 
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-red-600">
          Close Modal
        </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
