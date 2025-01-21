import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) return '';

  // Format: DD/MM/YYYY
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export const formatOfficeString = (officeName) => {
  return officeName
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export const getUrgencyVariant = (urgency) => {
  const variants = {
    URGENT: 'destructive',
    NORMAL: 'default',
    LOW: 'secondary',
  };
  return variants[urgency] || 'default';
};
