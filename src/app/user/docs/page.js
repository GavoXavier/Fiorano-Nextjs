import Sidebar from "../components/Sidebar";

export default function DocsPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 flex-1">
        <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
        <p className="text-lg">Select a category from the sidebar to view API details.</p>
      </div>
    </div>
  );
}
