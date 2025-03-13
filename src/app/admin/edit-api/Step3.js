"use client";

import { useState } from "react";

export default function Step3({ formData, setFormData, onPrevious, onSubmit, loading, resetForm }) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 3: Examples & Submit</h2>

      {/* ✅ Example Request JSON */}
      <label className="block text-sm font-medium mb-1">Example Request (JSON)</label>
      <textarea placeholder="Enter example request JSON..." value={formData.request_example} onChange={(e) => setFormData({ ...formData, request_example: e.target.value })} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>

      {/* ✅ Example Response JSON */}
      <label className="block text-sm font-medium mb-1">Example Response (JSON)</label>
      <textarea placeholder="Enter example response JSON..." value={formData.response_example} onChange={(e) => setFormData({ ...formData, response_example: e.target.value })} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>

      {/* ✅ CURL Example */}
      <label className="block text-sm font-medium mb-1">CURL Example</label>
      <textarea placeholder="Enter CURL command..." value={formData.curl_example} onChange={(e) => setFormData({ ...formData, curl_example: e.target.value })} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>

      {/* ✅ Navigation Buttons */}
      <div className="mt-6">
        <button onClick={onPrevious} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Previous</button>
        <button onClick={() => setShowOverlay(true)} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
      </div>

      {/* ✅ Submission Confirmation Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>

            {/* ✅ Example Request */}
            <h3 className="text-lg font-semibold">Example Request</h3>
            <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded">{formData.request_example}</pre>

            {/* ✅ Example Response */}
            <h3 className="text-lg font-semibold">Example Response</h3>
            <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded">{formData.response_example}</pre>

            {/* ✅ CURL Example */}
            <h3 className="text-lg font-semibold">CURL Example</h3>
            <pre className="bg-gray-200 dark:bg-gray-700 p-3 rounded">{formData.curl_example}</pre>

            {/* ✅ Confirmation Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowOverlay(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={() => { onSubmit(); setShowOverlay(false); resetForm(); }} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
                {loading ? "Submitting..." : "Confirm Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
