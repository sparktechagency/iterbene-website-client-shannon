// Utility functions for handling name conversions

export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return { firstName, lastName };
};

export const joinNames = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

export const getFullName = (user: { firstName?: string; lastName?: string; fullName?: string }): string => {
  // If firstName and lastName exist, use them
  if (user.firstName || user.lastName) {
    return joinNames(user.firstName, user.lastName);
  }
  // Fallback to fullName if it exists
  return user.fullName || '';
};