export interface Calendar {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  isLocal: boolean;
  accountId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: number;
  endTime: number;
  isAllDay: boolean;
  recurrenceRule?: string;
  recurrenceEnd?: number;
  calendarId: string;
  tagIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Reminder {
  id: string;
  eventId: string;
  minutesBefore: number;
  reminderType: 'notification' | 'alarm';
  isEnabled: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type ViewMode = 'month' | 'week' | 'day' | 'year';

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  viewMode: ViewMode;
  calendars: Calendar[];
  events: Event[];
  tags: Tag[];
  reminders: Reminder[];
  searchQuery: string;
  selectedCalendarIds: string[];
  selectedTagIds: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  defaultReminderMinutes: number;
  reminderSound: boolean;
  reminderVibration: boolean;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  timeFormat: '12h' | '24h';
  dateFormat: string;
}
