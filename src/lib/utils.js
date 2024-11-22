import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
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
