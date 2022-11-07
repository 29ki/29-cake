import {useCallback, useEffect} from 'react';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {find} from 'ramda';

import useNotificationsState from '../state/state';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';

export const getTriggerNotificationById = async (id: string) => {
  const notifications = await notifee.getTriggerNotifications();
  return find(({notification}) => notification.id === id, notifications)
    ?.notification;
};

const useTriggerNotification = (id: string) => {
  const triggerNotification = useNotificationsState(
    state => state.notifications[id],
  );
  const setNotification = useNotificationsState(state => state.setNotification);

  const updateNotification = useCallback(async () => {
    // Allways get notification data from source (notifee)
    setNotification(id, await getTriggerNotificationById(id));
  }, [id, setNotification]);

  useEffect(() => {
    // Get existing notification on mount
    updateNotification();

    // Keep state in sync with notification events
    return notifee.onForegroundEvent(async ({detail}) => {
      if (detail.notification?.id === id) {
        updateNotification();
      }
    });
  }, [id, updateNotification]);

  // Update notification when coming back from backgrounded
  useResumeFromBackgrounded(updateNotification);

  const setTriggerNotification = useCallback(
    async (title: string, body: string, timestamp: number) => {
      // TODO: handle declined permissions better
      await notifee.requestPermission();

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
      };

      // Create a trigger notification
      const notification = {
        id,
        title,
        body,
        android: {
          channelId: 'reminders',
        },
      };

      // Optimistic add, will be updated when created by notifee
      setNotification(id, notification);

      await notifee.createTriggerNotification(notification, trigger);
    },
    [id, setNotification],
  );

  const removeTriggerNotification = async () => {
    await notifee.cancelTriggerNotification(id);
    setNotification(id, undefined);
  };

  return {
    triggerNotification,
    setTriggerNotification,
    removeTriggerNotification,
  };
};

export default useTriggerNotification;
