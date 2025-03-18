"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username: credentials.username,
      password: credentials.password,
    });

    if (result.error) {
      setError("❌ Invalid username or password");
      setLoading(false);
    } else {
      setShowLoadingScreen(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    }
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen />}
      <div className="min-h-screen flex items-center justify-center bg-[#1a0525] text-white">
        <div className="bg-[#12011c] p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-bold text-purple-400 text-center mb-4">Admin Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && !showLoadingScreen && <p className="text-blue-400 text-center mb-4">Logging in...</p>}

          <form onSubmit={handleLogin} className="flex flex-col">
            <label className="mb-2 text-gray-300">Username</label>
            <input
              type="text"
              className="p-2 mb-4 rounded bg-[#2a0a3c] border border-gray-600"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />

            <label className="mb-2 text-gray-300">Password</label>
            <input
              type="password"
              className="p-2 mb-6 rounded bg-[#2a0a3c] border border-gray-600"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />

            <button type="submit" className="bg-purple-600 hover:bg-purple-800 text-white py-3 rounded-lg text-lg">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
