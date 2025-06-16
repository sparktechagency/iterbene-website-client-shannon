// import moment from "moment";

// export const getMessengerTimeFormat = (date: string | Date): string => {
//   const messageTime = moment(date);
//   const now = moment();
  
//   const diffInSeconds = now.diff(messageTime, 'seconds');
//   const diffInMinutes = now.diff(messageTime, 'minutes');
//   const diffInHours = now.diff(messageTime, 'hours');
//   const diffInDays = now.diff(messageTime, 'days');
//   const diffInWeeks = now.diff(messageTime, 'weeks');
//   const diffInYears = now.diff(messageTime, 'years');

//   // Just now (less than 1 minute)
//   if (diffInSeconds < 60) {
//     return "just now";
//   }
  
//   // Minutes (1-59 minutes)
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes}m`;
//   }
  
//   // Hours (1-23 hours)
//   if (diffInHours < 24) {
//     return `${diffInHours}h`;
//   }
  
//   // Days (1-6 days)
//   if (diffInDays < 7) {
//     return `${diffInDays}d`;
//   }
  
//   // Weeks (1-51 weeks)
//   if (diffInWeeks < 52) {
//     return `${diffInWeeks}w`;
//   }
  
//   // Years (1+ years)
//   return `${diffInYears}y`;
// };


import moment from "moment";

export const getMessengerTimeFormat = (date: string | Date): string => {
  const messageTime = moment(date);
  const now = moment();
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');
  const oneWeekAgo = moment().subtract(7, 'days');
  
  // Today - show time (2:30 PM)
  if (messageTime.isSame(today, 'day')) {
    return messageTime.format('h:mm A');
  }
  
  // Yesterday
  if (messageTime.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }
  
  // This week (within 7 days) - show day name (Monday, Tuesday)
  if (messageTime.isAfter(oneWeekAgo) && messageTime.isBefore(today)) {
    return messageTime.format('dddd');
  }
  
  // This year but older than a week - show month and date (May 31)
  if (messageTime.isSame(now, 'year')) {
    return messageTime.format('MMM D');
  }
  
  // Different year - show date with year (5/31/23)
  return messageTime.format('M/D/YY');
};