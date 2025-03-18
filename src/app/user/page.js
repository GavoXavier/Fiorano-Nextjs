"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";

export default function UserHomePage() {
  const router = useRouter();
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAPIs() {
      try {
        const response = await axios.get("/api/apis");
        setApis(response.data);
      } catch (error) {
        console.error("❌ Error fetching APIs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAPIs();
  }, []);

  return (
    <div className="bg-[#1a0525] text-white min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center text-center px-6 py-10">
        {/* ✅ Animated Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Fiorano API Docs
        </motion.h1>

        {/* ✅ Animated Subtitle */}
        <motion.p
          className="mt-4 text-lg md:text-2xl text-gray-300 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Seamless integration. Powerful performance. Explore our APIs to build
          the future.
        </motion.p>

        {/* ✅ Get Started Button */}
        <motion.a
          href="/user"
          className="mt-6 bg-purple-600 hover:bg-purple-800 text-white py-3 px-6 rounded-lg text-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>

        {/* ✅ API List Section */}
        <motion.div
          className="mt-10 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Available APIs</h2>
          
          {loading ? (
            <p className="text-blue-300">Loading APIs...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {apis.map((api, index) => (
                <motion.div
                  key={api.id}
                  className="p-4 border border-purple-600 bg-[#2a093c] rounded shadow-lg hover:shadow-purple-500 transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-bold text-white">{api.name}</h3>
                  <p className="text-sm text-gray-300">{api.description}</p>
                  <button
                    onClick={() => router.push(`/user/${api.id}`)}
                    className="mt-2 bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    View API
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
