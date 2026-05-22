export const unwrapApiData = (response) => {
  const body = response?.data;

  if (body && Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data;
  }

  return body;
};

export const getApiErrorMessage = (error, fallback = 'Não foi possível concluir a operação.') => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    fallback
  );
};
