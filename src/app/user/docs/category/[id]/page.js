"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/user/components/Sidebar";
import Link from "next/link";

export default function CategoryPage({ params }) {
  const { id } = params;
  const [category, setCategory] = useState(null);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryAndApis = async () => {
      try {
        // Fetch Category Info
        const categoryRes = await fetch(`/api/categories?id=${id}`);
        const categoryData = await categoryRes.json();
        if (categoryData.length === 0) throw new Error("Category not found");

        // Fetch APIs under this category
        const apiRes = await fetch(`/api/apis?category_id=${id}`);
        const apiData = await apiRes.json();

        setCategory(categoryData[0]);
        setApis(apiData);
      } catch (err) {
        setError("Failed to load category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndApis();
  }, [id]);

  if (loading) return <p className="p-6">Loading category...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 flex-1">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-300 mb-6">{category.description}</p>

        <h2 className="text-2xl font-semibold mb-3">Available APIs</h2>
        <ul className="space-y-2">
          {apis.length === 0 ? (
            <p className="text-gray-400">No APIs available for this category.</p>
          ) : (
            apis.map((api) => (
              <li key={api.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <Link href={`/user/docs/api/${api.id}`} className="block">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{api.name}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{api.description}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
