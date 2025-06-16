import moment from "moment";

export const getMessengerTimeFormat = (date: string | Date): string => {
  const messageTime = moment(date);
  const now = moment();
  
  const diffInSeconds = now.diff(messageTime, 'seconds');
  const diffInMinutes = now.diff(messageTime, 'minutes');
  const diffInHours = now.diff(messageTime, 'hours');
  const diffInDays = now.diff(messageTime, 'days');
  const diffInWeeks = now.diff(messageTime, 'weeks');
  const diffInYears = now.diff(messageTime, 'years');

  // Just now (less than 1 minute)
  if (diffInSeconds < 60) {
    return "just now";
  }
  
  // Minutes (1-59 minutes)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  
  // Hours (1-23 hours)
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  
  // Days (1-6 days)
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  
  // Weeks (1-51 weeks)
  if (diffInWeeks < 52) {
    return `${diffInWeeks}w`;
  }
  
  // Years (1+ years)
  return `${diffInYears}y`;
};