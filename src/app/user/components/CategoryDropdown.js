"use client";
import { useState } from "react";
import Link from "next/link";

export default function CategoryDropdown({ category, apis }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        {category.name}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ul className="pl-6 mt-2">
          {apis.length === 0 ? (
            <p className="text-gray-400">No APIs available</p>
          ) : (
            apis.map((api) => (
              <li key={api.id} className="mb-1">
                <Link href={`/user/docs/api/${api.id}`} className="block px-4 py-1 hover:bg-gray-600 rounded">
                  {api.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </li>
  );
}
