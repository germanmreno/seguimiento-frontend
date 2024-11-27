export const MEMO_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
  ASSIGNED: 'ASSIGNED',
};

export const STATUS_STYLES = {
  [MEMO_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [MEMO_STATUS.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [MEMO_STATUS.ARCHIVED]: 'bg-gray-100 text-gray-800 border-gray-200',
  [MEMO_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-800 border-blue-200',
};

export const STATUS_TEXT = {
  [MEMO_STATUS.PENDING]: 'Pendiente',
  [MEMO_STATUS.COMPLETED]: 'Completado',
  [MEMO_STATUS.ARCHIVED]: 'Archivado',
  [MEMO_STATUS.ASSIGNED]: 'Asignado',
};
