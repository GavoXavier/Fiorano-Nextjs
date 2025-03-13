// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Step1 from "./Step1";
// import Step2 from "./Step2";
// import Step3 from "./Step3";
// import Breadcrumbs from "./Breadcrumbs";

// const CATEGORY_API = "/api/categories";
// const SCHEMA_API = "/api/schemas";
// const API_URL = "/api/apis";

// export default function AddAPI() {
//   const [step, setStep] = useState(1);
//   const [categories, setCategories] = useState([]);
//   const [schemas, setSchemas] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   // ✅ Define Reset Function
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       endpoint: "",
//       method: "GET",
//       description: "",
//       category_id: "",
//       schema_id: "",
//       headers: [],
//       query_params: [],
//       request_body: [],
//       response_body: [],
//       response_codes: [],
//       request_example: "",
//       response_example: "",
//       curl_example: "",
//     });
//     setStep(1); // ✅ Return to Step 1
//   };

//   const [formData, setFormData] = useState({
//     name: "",
//     endpoint: "",
//     method: "GET",
//     description: "",
//     category_id: "",
//     schema_id: "",
//     headers: [],
//     query_params: [],
//     request_body: [],
//     response_body: [],
//     response_codes: [],
//     request_example: "",
//     response_example: "",
//     curl_example: "",
//   });

//   useEffect(() => {
//     fetchCategories();
//     fetchSchemas();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(CATEGORY_API);
//       setCategories(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching categories:", error);
//     }
//   };

//   const fetchSchemas = async () => {
//     try {
//       const response = await axios.get(SCHEMA_API);
//       setSchemas(response.data);
//     } catch (error) {
//       console.error("❌ Error fetching schemas:", error);
//     }
//   };

//   const handleNext = () => setStep((prev) => prev + 1);
//   const handlePrevious = () => setStep((prev) => prev - 1);

//   // ✅ Submit Function with Reset
//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await axios.post(API_URL, formData);
//       alert("✅ API Added Successfully!");
//       resetForm(); // ✅ Reset after submission
//     } catch (error) {
//       console.error("❌ Error saving API:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
//       <Breadcrumbs step={step} setStep={setStep} />
//       {step === 1 && <Step1 formData={formData} setFormData={setFormData} categories={categories} onNext={handleNext} />}
//       {step === 2 && <Step2 formData={formData} setFormData={setFormData} schemas={schemas} onNext={handleNext} onPrevious={handlePrevious} />}
//       {step === 3 && <Step3 formData={formData} setFormData={setFormData} onPrevious={handlePrevious} onSubmit={handleSubmit} loading={loading} resetForm={resetForm} />}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

export default function AddAPI() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "GET",
    description: "",
    category_id: "",
    schema_id: "",
    headers: [],
    query_params: [],
    request_body: [],
    request_example: {},
    response_body: [],
    response_example: {},
    response_codes: [],
    curl_example: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("apiFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("apiFormData", JSON.stringify(formData));
  }, [formData]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const resetForm = () => {
    localStorage.removeItem("apiFormData");
    setFormData({
      name: "",
      endpoint: "",
      method: "GET",
      description: "",
      category_id: "",
      schema_id: "",
      headers: [],
      query_params: [],
      request_body: [],
      request_example: {},
      response_body: [],
      response_example: {},
      response_codes: [],
      curl_example: "",
    });
    setStep(1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Add API - Step {step}</h1>

      {step === 1 && <Step1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
      {step === 4 && <Step4 formData={formData} setFormData={setFormData} prevStep={prevStep} resetForm={resetForm} />}

      {/* ✅ Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-gray-300 h-2 rounded">
          <div className="bg-blue-500 h-2 rounded transition-all" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">Step {step} of 4</p>
      </div>
    </div>
  );
}
