"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("🔹 Session Data:", session); // Check what NextAuth returns
    if (status === "loading") return; // Prevent premature redirection

    if (!session) {
      router.replace("/login");
    } else if (session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session?.user?.username}!</p>
      <p>Role: {session?.user?.role}</p> {/* Display user role for debugging */}
      <button
        onClick={() => signOut()}
        className="mt-4 bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
