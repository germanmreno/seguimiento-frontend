import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'No especificado';
  try {
    const date =
      typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return 'No especificado';
  try {
    const fullTimeString =
      timeString.length <= 5 ? `2000-01-01T${timeString}` : timeString;
    const date = parseISO(fullTimeString);
    return format(date, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Hora inválida';
  }
};

export const formatTimeWithPeriod = (hour, minute) => {
  const formattedHour = hour.padStart(2, '0');
  const formattedMinute = minute.padStart(2, '0');
  const period = parseInt(hour, 10) >= 12 ? 'PM' : 'AM';
  return {
    time: `${formattedHour}:${formattedMinute}`,
    period,
  };
};
