"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-gray-800 p-4 shadow flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </header>

          {/* Page Content */}
          <main className="p-6 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
