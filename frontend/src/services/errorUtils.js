export function extractErrorMessage(error, fallback = "Something went wrong") {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors.join(", ");
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}

export function toFieldErrors(validationResult) {
  return validationResult?.errors || {};
}
