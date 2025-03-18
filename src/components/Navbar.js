"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log("🔹 Navbar - Session Data:", session);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-[#2a093c] text-white p-4">
      <div className="flex justify-between">
        <Link href="/user" className="text-xl font-bold text-purple-400">API Docs</Link>
        
        <div className="space-x-4">
          {session ? (
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <Link href="/login" className="bg-purple-600 px-4 py-2 rounded">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
