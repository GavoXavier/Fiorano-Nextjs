export const validateStep1 = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = "API Name is required.";
    if (!data.endpoint.trim()) errors.endpoint = "Endpoint URL is required.";
    if (!data.category_id) errors.category_id = "Category is required.";
    return errors;
  };
  