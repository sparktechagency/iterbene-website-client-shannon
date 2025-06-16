import { IMessage } from "@/types/messagesType";
import moment from "moment";

export const getDateGroupLabel = (date: string | Date): string => {
  const messageDate = moment(date);
  const today = moment();
  const yesterday = moment().subtract(1, 'day');
  const oneWeekAgo = moment().subtract(7, 'days');
  
  // Today - show time as well
  if (messageDate.isSame(today, 'day')) {
    return `Today ${messageDate.format('h:mm A')}`; // Today 2:30 PM
  }
  
  // Yesterday
  if (messageDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }
  
  // This week (within 7 days) - show day name
  if (messageDate.isAfter(oneWeekAgo) && messageDate.isBefore(today)) {
    return messageDate.format('dddd'); // Monday, Tuesday, etc.
  }
  
  // This year but older than a week - show date with day name
  if (messageDate.isSame(today, 'year')) {
    return messageDate.format('dddd, MMMM D'); // Saturday, May 31
  }
  
  // Different year - show full date with year
  return messageDate.format('dddd, MMMM D, YYYY'); // Saturday, May 31, 2023
};

export const groupMessagesByDate = (messages: IMessage[]) => {
  const grouped: { [key: string]: IMessage[] } = {};
  
  messages.forEach(message => {
    const dateKey = moment(message.createdAt).format('YYYY-MM-DD');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });
  
  return grouped;
};