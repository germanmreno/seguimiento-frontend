import { handleApiError } from '@/lib/apiErrorHandler';

export const processFileUpload = async (file, uploadFunction) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await uploadFunction(formData);
  } catch (error) {
    throw new Error(handleApiError(error, 'Error al subir el archivo'));
  }
};

export const validateMemoData = (data) => {
  const errors = [];

  if (!data.name?.trim()) {
    errors.push('El nombre es requerido');
  }

  if (!data.applicant?.trim()) {
    errors.push('El solicitante es requerido');
  }

  if (!data.reception_method) {
    errors.push('El método de recepción es requerido');
  }

  return errors;
};

export const prepareMemoFormData = (data, files = {}) => {
  const formData = new FormData();

  // Add basic memo data
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // Add files if present
  if (files.reception) {
    files.reception.forEach((file) => {
      formData.append('reception_files', file);
    });
  }

  if (files.attachments) {
    files.attachments.forEach((file) => {
      formData.append('attachment_files', file);
    });
  }

  return formData;
};
