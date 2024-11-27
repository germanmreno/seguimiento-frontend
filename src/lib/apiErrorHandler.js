export const handleApiError = (
  error,
  defaultMessage = 'Ha ocurrido un error'
) => {
  console.error('API Error:', error);

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

export const isNetworkError = (error) => {
  return !error.response && error.message === 'Network Error';
};

export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};
