// Format a number as an Indian-rupee currency string.
export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

// Format an ISO date string into a readable date + time.
export const formatDate = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// Pull a human-friendly message out of an axios error.
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;
  if (data?.errors?.length) return data.errors[0].message;
  return data?.message || error?.message || fallback;
};
