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

export interface Weather {
  id: string;
  cityName: string;
  countryName?: string;
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weather: string;
    icon: string;
    lastUpdated: number;
  };
  forecast7d?: Array<{
    date: number;
    temperatureMax: number;
    temperatureMin: number;
    weather: string;
    icon: string;
  }>;
  forecast24h?: Array<{
    time: number;
    temperature: number;
    weather: string;
    icon: string;
  }>;
}

export interface SavedCity {
  id: string;
  cityName: string;
  countryName?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  sortOrder: number;
  createdAt: number;
}

export interface UserWeatherSettings {
  locationType: 'gps' | 'manual' | 'ip';
  temperatureUnit: 'celsius' | 'fahrenheit';
  autoUpdate: boolean;
  updateFrequency: number;
  showCityName: boolean;
  showAirQuality: boolean;
  showLifeIndex: boolean;
  weatherNotification: boolean;
  defaultCityId?: string;
  updatedAt: number;
}

export interface Alarm {
  id: string;
  hour: number;
  minute: number;
  label?: string;
  isEnabled: boolean;
  repeatType: 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom';
  repeatDays: number[];
  ringtoneUri?: string;
  ringtoneName?: string;
  vibrationEnabled: boolean;
  snoozeEnabled: boolean;
  snoozeMinutes: number;
  snoozeCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface AlarmLog {
  id: string;
  alarmId: string;
  triggerTime: number;
  stopTime?: number;
  snoozeCount: number;
  action: 'snooze' | 'stop';
  createdAt: number;
}

export interface UserAlarmSettings {
  defaultRingtoneUri?: string;
  defaultRingtoneName?: string;
  defaultVibration: boolean;
  defaultSnoozeMinutes: number;
  defaultSnoozeCount: number;
  gradualVolume: boolean;
  maxRingDuration: number;
  ringInSilent: boolean;
  showInNotification: boolean;
  updatedAt: number;
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
  weatherSettings: UserWeatherSettings;
  alarmSettings: UserAlarmSettings;
}
