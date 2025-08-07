import { useState, useEffect, useCallback } from 'react';
import { useSocket } from "@/lib/socket";
import {
  useGetUnviewedMessageNotificationsCountQuery,
  useGetUnviewedNotificationsCountQuery,
} from "@/redux/features/notifications/notificationsApi";

export const useNotifications = (userId?: string) => {
  const [messageCount, setMessageCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const socket = useSocket();

  // API queries
  const { data: messageNotificationsData, refetch: refetchMessageCount } = 
    useGetUnviewedMessageNotificationsCountQuery(undefined, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });

  const { data: notificationsData, refetch: refetchNotificationCount } = 
    useGetUnviewedNotificationsCountQuery(undefined, {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });

  // Update counts from API
  useEffect(() => {
    if (messageNotificationsData?.data?.attributes?.count) {
      setMessageCount(messageNotificationsData.data.attributes.count);
    }
  }, [messageNotificationsData]);

  useEffect(() => {
    if (notificationsData?.data?.attributes?.count) {
      setNotificationCount(notificationsData.data.attributes.count);
    }
  }, [notificationsData]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewMessage = () => {
      setMessageCount(prev => prev + 1);
      refetchMessageCount();
    };

    const handleNewNotification = () => {
      setNotificationCount(prev => prev + 1);
      refetchNotificationCount();
    };

    const handleMessageViewed = () => {
      setMessageCount(prev => Math.max(0, prev - 1));
      refetchMessageCount();
    };

    const handleNotificationViewed = () => {
      setNotificationCount(prev => Math.max(0, prev - 1));
      refetchNotificationCount();
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newNotification', handleNewNotification);
    socket.on('messageViewed', handleMessageViewed);
    socket.on('notificationViewed', handleNotificationViewed);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newNotification', handleNewNotification);
      socket.off('messageViewed', handleMessageViewed);
      socket.off('notificationViewed', handleNotificationViewed);
    };
  }, [socket, userId, refetchMessageCount, refetchNotificationCount]);

  const resetMessageCount = useCallback(() => {
    setMessageCount(0);
    refetchMessageCount();
  }, [refetchMessageCount]);

  const resetNotificationCount = useCallback(() => {
    setNotificationCount(0);
    refetchNotificationCount();
  }, [refetchNotificationCount]);

  return {
    messageCount,
    notificationCount,
    resetMessageCount,
    resetNotificationCount,
  };
};