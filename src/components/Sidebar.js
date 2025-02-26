"use client";

import { useState } from "react";
import Link from "next/link";

const Sidebar = ({ isOpen }) => {
  const [apiDropdown, setApiDropdown] = useState(false);
  const [schemaDropdown, setSchemaDropdown] = useState(false);

  return (
    <aside className={`h-full transition-all duration-300 p-4 bg-white dark:bg-gray-800 shadow ${isOpen ? "w-64" : "w-16"}`}>
      <h2 className={`text-xl font-bold mb-4 text-gray-900 dark:text-white ${isOpen ? "block" : "hidden"}`}>Admin Panel</h2>
      
      <ul className="space-y-2">
        {/* ✅ Dashboard */}
        <li>
          <Link href="/admin" className="block py-2 px-3 text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            Dashboard
          </Link>
        </li>

        {/* ✅ APIs Dropdown */}
        <li>
          <button 
            onClick={() => setApiDropdown(!apiDropdown)} 
            className="w-full text-left py-2 px-3 text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex justify-between"
          >
            APIs
            <span>{apiDropdown ? "▲" : "▼"}</span>
          </button>
          {apiDropdown && (
            <ul className="pl-4 space-y-1">
              <li>
                <Link href="/admin/add-api" className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Add API
                </Link>
              </li>
              <li>
                <Link href="/admin/edit-api" className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Edit API
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* ✅ Categories */}
        <li>
          <Link href="/admin/categories" className="block py-2 px-3 text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            Categories
          </Link>
        </li>

        {/* ✅ Schemas Dropdown */}
        <li>
          <button 
            onClick={() => setSchemaDropdown(!schemaDropdown)} 
            className="w-full text-left py-2 px-3 text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex justify-between"
          >
            Schemas
            <span>{schemaDropdown ? "▲" : "▼"}</span>
          </button>
          {schemaDropdown && (
            <ul className="pl-4 space-y-1">
              <li>
                <Link href="/admin/schemas" className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Schemas
                </Link>
              </li>
              <li>
                <Link href="/admin/schema-edit" className="block py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Edit Schema
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* ✅ Logout Button */}
        <li>
          <button 
            onClick={() => alert("Logging out...")} 
            className="w-full py-2 px-3 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
