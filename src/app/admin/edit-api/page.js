"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import EditOverlay from "./EditOverlay";

const API_URL = "/api/apis";

export default function EditAPI() {
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    try {
      const response = await axios.get(API_URL);
      setApis(response.data);
    } catch (error) {
      console.error("❌ Error fetching APIs:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Manage APIs</h1>

      {/* ✅ Grid Layout for APIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {apis.map((api) => (
          <button
            key={api.id}
            onClick={() => setSelectedApi(api)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:scale-105 transition"
          >
            <h2 className="text-lg font-semibold">{api.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{api.endpoint}</p>
          </button>
        ))}
      </div>

      {/* ✅ Multi-step Edit Overlay */}
      {selectedApi && <EditOverlay api={selectedApi} onClose={() => setSelectedApi(null)} />}
    </div>
  );
}
