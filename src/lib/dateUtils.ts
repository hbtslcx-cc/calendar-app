import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  getYear,
  setYear,
  getMonth,
  setMonth,
  getDate,
  setDate,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr, { locale: zhCN });
};

export const getMonthDays = (date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const getWeekDays = (date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date[] => {
  const weekStart = startOfWeek(date, { weekStartsOn });
  const weekEnd = endOfWeek(date, { weekStartsOn });

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

export const getYearMonths = (date: Date): Date[] => {
  const year = getYear(date);
  const months: Date[] = [];

  for (let month = 0; month < 12; month++) {
    months.push(setMonth(setYear(new Date(), year), month));
  }

  return months;
};

export const getDayHours = (): number[] => {
  return Array.from({ length: 24 }, (_, i) => i);
};

export const isDateInMonth = (date: Date, monthDate: Date): boolean => {
  return isSameMonth(date, monthDate);
};

export const isDateToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isDateSelected = (date: Date, selectedDate: Date): boolean => {
  return isSameDay(date, selectedDate);
};

export const navigateDate = (
  currentDate: Date,
  direction: 'prev' | 'next',
  viewMode: 'month' | 'week' | 'day' | 'year'
): Date => {
  switch (viewMode) {
    case 'month':
      return direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    case 'week':
      return direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
    case 'day':
      return direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    case 'year':
      const newYear = direction === 'prev' ? getYear(currentDate) - 1 : getYear(currentDate) + 1;
      return setYear(currentDate, newYear);
    default:
      return currentDate;
  }
};

export const getWeekdayNames = (weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): string[] => {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const ordered = [...weekdays.slice(weekStartsOn), ...weekdays.slice(0, weekStartsOn)];
  return ordered;
};

export const getMonthNames = (): string[] => {
  return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
};

export const formatTime = (timestamp: number, format24h: boolean = true): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (format24h) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    const period = hours >= 12 ? '下午' : '上午';
    const displayHours = hours % 12 || 12;
    return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  }
};

export const formatEventDuration = (startTime: number, endTime: number): string => {
  const duration = endTime - startTime;
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0 && minutes > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (hours > 0) {
    return `${hours}小时`;
  } else {
    return `${minutes}分钟`;
  }
};
