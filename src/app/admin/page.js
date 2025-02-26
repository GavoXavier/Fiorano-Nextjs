"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]); // Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      // ✅ Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories available.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
