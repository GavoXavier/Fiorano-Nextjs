export default function UserLayout({ children }) {
    return (
      <div className="bg-[#1a0525] text-white min-h-screen flex flex-col">
        <header className="w-full p-4 bg-[#1a0525] shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            {/* ✅ Logo */}
            <a href="/user" className="text-2xl font-bold text-purple-400 hover:text-purple-300">
              Fiorano API Docs
            </a>
  
            {/* ✅ Navigation Links */}
            <div className="flex space-x-6">
              <a href="/user" className="hover:text-gray-300 transition">API Docs</a>
              <a href="/login" className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded transition">
                Admin Login
              </a>
            </div>
          </div>
        </header>
  
        {/* ✅ Main Content */}
        <main className="flex-grow flex flex-col">{children}</main>
  
        {/* ✅ Unified Footer */}
        <footer className="w-full py-6 bg-[#1a0525] text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Fiorano API Docs. All rights reserved.
        </footer>
      </div>
    );
  }
  