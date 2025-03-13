export default function Breadcrumbs({ step, setStep }) {
    const steps = ["API Details", "Schema & Fields", "Examples & Submit"];
  
    return (
      <div className="flex mb-6">
        {steps.map((label, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-2 text-sm font-bold ${step === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} rounded`}
            onClick={() => setStep(index + 1)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }
  