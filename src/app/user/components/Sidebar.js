"use client";
import { useEffect, useState } from "react";
import CategoryDropdown from "./CategoryDropdown";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoriesAndApis = async () => {
      try {
        // Fetch Categories
        const categoryRes = await fetch("/api/categories");
        const categoryData = await categoryRes.json();

        // Fetch APIs
        const apiRes = await fetch("/api/apis");
        const apiData = await apiRes.json();

        // Organize APIs under their respective categories
        const categorizedApis = {};
        categoryData.forEach((category) => {
          categorizedApis[category.id] = apiData.filter(api => api.category_id === category.id);
        });

        setCategories(categoryData);
        setApis(categorizedApis);
      } catch (err) {
        setError("Failed to load categories or APIs.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndApis();
  }, []);

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-4 fixed overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
      <ul>
        <li className="mb-2">
          <a href="/user/docs" className="block px-4 py-2 hover:bg-gray-700 rounded">Home</a>
        </li>
        <li className="mb-2">
          <a href="/user/docs/authentication" className="block px-4 py-2 hover:bg-gray-700 rounded">Authentication</a>
        </li>

        {loading ? <p>Loading categories...</p> : 
          error ? <p className="text-red-500">{error}</p> : 
          categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => (
              <CategoryDropdown key={category.id} category={category} apis={apis[category.id] || []} />
          ))
        }
      </ul>
    </aside>
  );
}
