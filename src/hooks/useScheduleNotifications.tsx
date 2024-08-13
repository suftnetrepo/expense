/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { TriggerType, TimestampTrigger, AndroidImportance } from '@notifee/react-native';
import { queryCardsByStatus } from '../model/card';

const useScheduleNotifications = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState(new Set());

  useEffect(() => {

    const loadScheduledNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('scheduledNotifications');
        if (storedNotifications) {
          setScheduledNotifications(new Set(JSON.parse(storedNotifications)));
        }
      } catch (error) {
        if (__DEV__)
          console.error('Failed to load scheduled notifications', error);
      }
    };

    const saveScheduledNotifications = async (notifications: Set<unknown>) => {
      try {
        await AsyncStorage.setItem('scheduledNotifications', JSON.stringify([...notifications]));
      } catch (error) {
        if (__DEV__)
          console.error('Failed to save scheduled notifications', error);
      }
    };

    const scheduleNotifications = async () => {   
      const reminders = await queryCardsByStatus(1);
   
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      const newScheduledNotifications = new Set(scheduledNotifications);

      for (const reminder of reminders) {
        const appointmentDate = new Date(reminder.date);
        const appointmentTime = new Date(reminder.time);

        const appointmentDateTime = new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          appointmentDate.getDate(),
          appointmentTime.getHours(),
          appointmentTime.getMinutes(),
          appointmentTime.getSeconds()
        );
        const now = new Date();
      
        if (reminder.reminder && appointmentDateTime > now) {
         
          for (let daysBefore = 1; daysBefore <= reminder.reminder; daysBefore++) {
            let triggerTime = appointmentDateTime.getTime() - (daysBefore * 24 * 60 * 60 * 1000);
            let reminderText = `This is your reminder for the vaccine appointment in ${daysBefore} day(s).`;

            const trigger: TimestampTrigger = {
              type: TriggerType.TIMESTAMP,
              timestamp: triggerTime,
            };
           
            const notificationId = `${reminder.child_id}-${reminder.vaccine_id}-${daysBefore}`;
            if (!newScheduledNotifications.has(notificationId)) {
              await notifee.createTriggerNotification(
                {
                  title: 'Vaccine Appointment Reminder',
                  body: reminderText,
                  android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                  },
                },
                trigger
              );

              newScheduledNotifications.add(notificationId);
            }
          }
        }
      }

      setScheduledNotifications(newScheduledNotifications);
      saveScheduledNotifications(newScheduledNotifications);
    };

    loadScheduledNotifications()
    scheduleNotifications();
    
  }, []);
};

export default useScheduleNotifications;
