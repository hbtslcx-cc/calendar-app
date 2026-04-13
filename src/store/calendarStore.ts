import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Calendar, Event, Tag, Reminder, ViewMode, AppSettings } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';

interface CalendarStore {
  // State
  currentDate: Date;
  selectedDate: Date;
  viewMode: ViewMode;
  calendars: Calendar[];
  events: Event[];
  tags: Tag[];
  reminders: Reminder[];
  settings: AppSettings;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  
  // Calendar actions
  addCalendar: (calendar: Omit<Calendar, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateCalendar: (id: string, updates: Partial<Calendar>) => void;
  deleteCalendar: (id: string) => void;
  toggleCalendarVisibility: (id: string) => void;
  
  // Event actions
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => Event[];
  getEventsByDateRange: (start: Date, end: Date) => Event[];
  
  // Tag actions
  addTag: (tag: Omit<Tag, 'id'>) => string;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Reminder actions
  addReminder: (reminder: Omit<Reminder, 'id'>) => string;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getRemindersByEvent: (eventId: string) => Reminder[];
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Navigation
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

const defaultCalendars: Calendar[] = [
  {
    id: 'default',
    name: '我的日历',
    color: '#6750A4',
    isVisible: true,
    isLocal: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'work',
    name: '工作',
    color: '#4CAF50',
    isVisible: true,
    isLocal: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'personal',
    name: '个人',
    color: '#2196F3',
    isVisible: true,
    isLocal: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const defaultTags: Tag[] = [
  { id: 'important', name: '重要', color: '#F44336' },
  { id: 'meeting', name: '会议', color: '#FF9800' },
  { id: 'birthday', name: '生日', color: '#E91E63' },
];

const defaultSettings: AppSettings = {
  theme: 'system',
  primaryColor: '#6750A4',
  defaultReminderMinutes: 15,
  reminderSound: true,
  reminderVibration: true,
  weekStartsOn: 1,
  timeFormat: '24h',
  dateFormat: 'yyyy-MM-dd',
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      currentDate: new Date(),
      selectedDate: new Date(),
      viewMode: 'month',
      calendars: defaultCalendars,
      events: [],
      tags: defaultTags,
      reminders: [],
      settings: defaultSettings,

      setCurrentDate: (date) => set({ currentDate: date }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),

      addCalendar: (calendar) => {
        const id = uuidv4();
        const newCalendar: Calendar = {
          ...calendar,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ calendars: [...state.calendars, newCalendar] }));
        return id;
      },

      updateCalendar: (id, updates) => {
        set((state) => ({
          calendars: state.calendars.map((cal) =>
            cal.id === id ? { ...cal, ...updates, updatedAt: Date.now() } : cal
          ),
        }));
      },

      deleteCalendar: (id) => {
        set((state) => ({
          calendars: state.calendars.filter((cal) => cal.id !== id),
          events: state.events.filter((event) => event.calendarId !== id),
        }));
      },

      toggleCalendarVisibility: (id) => {
        set((state) => ({
          calendars: state.calendars.map((cal) =>
            cal.id === id ? { ...cal, isVisible: !cal.isVisible } : cal
          ),
        }));
      },

      addEvent: (event) => {
        const id = uuidv4();
        const newEvent: Event = {
          ...event,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ events: [...state.events, newEvent] }));
        return id;
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates, updatedAt: Date.now() } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          reminders: state.reminders.filter((reminder) => reminder.eventId !== id),
        }));
      },

      getEventsByDate: (date) => {
        const { events, calendars } = get();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return events.filter((event) => {
          const calendar = calendars.find((c) => c.id === event.calendarId);
          if (!calendar?.isVisible) return false;

          return (
            (event.startTime >= startOfDay.getTime() && event.startTime <= endOfDay.getTime()) ||
            (event.endTime >= startOfDay.getTime() && event.endTime <= endOfDay.getTime()) ||
            (event.startTime <= startOfDay.getTime() && event.endTime >= endOfDay.getTime())
          );
        });
      },

      getEventsByDateRange: (start, end) => {
        const { events, calendars } = get();
        return events.filter((event) => {
          const calendar = calendars.find((c) => c.id === event.calendarId);
          if (!calendar?.isVisible) return false;

          return (
            (event.startTime >= start.getTime() && event.startTime <= end.getTime()) ||
            (event.endTime >= start.getTime() && event.endTime <= end.getTime()) ||
            (event.startTime <= start.getTime() && event.endTime >= end.getTime())
          );
        });
      },

      addTag: (tag) => {
        const id = uuidv4();
        const newTag: Tag = { ...tag, id };
        set((state) => ({ tags: [...state.tags, newTag] }));
        return id;
      },

      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((tag) => (tag.id === id ? { ...tag, ...updates } : tag)),
        }));
      },

      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          events: state.events.map((event) => ({
            ...event,
            tagIds: event.tagIds.filter((tagId) => tagId !== id),
          })),
        }));
      },

      addReminder: (reminder) => {
        const id = uuidv4();
        const newReminder: Reminder = { ...reminder, id };
        set((state) => ({ reminders: [...state.reminders, newReminder] }));
        return id;
      },

      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          ),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      getRemindersByEvent: (eventId) => {
        return get().reminders.filter((reminder) => reminder.eventId === eventId);
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      goToToday: () => {
        const today = new Date();
        set({ currentDate: today, selectedDate: today });
      },

      goToPrevious: () => {
        const { currentDate, viewMode } = get();
        const newDate = new Date(currentDate);
        
        switch (viewMode) {
          case 'month':
            newDate.setMonth(newDate.getMonth() - 1);
            break;
          case 'week':
            newDate.setDate(newDate.getDate() - 7);
            break;
          case 'day':
            newDate.setDate(newDate.getDate() - 1);
            break;
          case 'year':
            newDate.setFullYear(newDate.getFullYear() - 1);
            break;
        }
        set({ currentDate: newDate });
      },

      goToNext: () => {
        const { currentDate, viewMode } = get();
        const newDate = new Date(currentDate);
        
        switch (viewMode) {
          case 'month':
            newDate.setMonth(newDate.getMonth() + 1);
            break;
          case 'week':
            newDate.setDate(newDate.getDate() + 7);
            break;
          case 'day':
            newDate.setDate(newDate.getDate() + 1);
            break;
          case 'year':
            newDate.setFullYear(newDate.getFullYear() + 1);
            break;
        }
        set({ currentDate: newDate });
      },
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({
        calendars: state.calendars,
        events: state.events,
        tags: state.tags,
        reminders: state.reminders,
        settings: state.settings,
      }),
    }
  )
);
