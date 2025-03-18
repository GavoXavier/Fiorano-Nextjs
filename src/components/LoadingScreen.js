export default function LoadingScreen() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a0525] text-white z-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-4 border-purple-400 rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="text-gray-300 mt-2">Please wait while we authenticate.</p>
        </div>
      </div>
    );
  }
  