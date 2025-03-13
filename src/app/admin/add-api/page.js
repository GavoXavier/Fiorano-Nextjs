"use client";
import { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import axios from "axios";

const CATEGORY_API = "/api/categories";
const SCHEMA_API = "/api/schemas";
const API_URL = "/api/apis";

export default function AddAPI() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);

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
    response_body: [],
    response_codes: [],
    request_example: "",
    response_example: "",
    curl_example: "",
  });

  // ✅ Load saved form data from localStorage (prevents data loss on refresh)
  useEffect(() => {
    const savedData = localStorage.getItem("apiFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("apiFormData", JSON.stringify(formData));
  }, [formData]);

  // ✅ Fetch categories & schemas on component mount
  useEffect(() => {
    fetchCategories();
    fetchSchemas();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API);
      setCategories(response.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  const fetchSchemas = async () => {
    try {
      const response = await axios.get(SCHEMA_API);
      setSchemas(response.data);
    } catch (error) {
      console.error("❌ Error fetching schemas:", error);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // ✅ Reset Form Function
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
      response_body: [],
      response_codes: [],
      request_example: "",
      response_example: "",
      curl_example: "",
    });
    setStep(1);
  };

  // ✅ Handle API Submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      alert("✅ API Added Successfully!");
      resetForm();
    } catch (error) {
      console.error("❌ Error saving API:", error);
      alert("❌ Failed to save API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Add API - Step {step} of 4</h1>

      {/* ✅ Render Steps */}
      {step === 1 && (
        <Step1 formData={formData} setFormData={setFormData} categories={categories} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2 formData={formData} setFormData={setFormData} schemas={schemas} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <Step3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 4 && (
        <Step4 formData={formData} setFormData={setFormData} prevStep={prevStep} resetForm={resetForm} handleSubmit={handleSubmit} loading={loading} />
      )}

      {/* ✅ Progress Bar */}
      <div className="mt-6 max-w-lg mx-auto">
        <div className="w-full bg-gray-300 h-2 rounded">
          <div
            className="bg-blue-500 h-2 rounded transition-all"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">Step {step} of 4</p>
      </div>
    </div>
  );
}
