import { useCalendarStore } from '@/store/calendarStore';
import { getMonthDays, getWeekdayNames, isDateInMonth, isDateToday, isDateSelected, formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

export function MonthView() {
  const { currentDate, selectedDate, setSelectedDate, settings, getEventsByDate, calendars } = useCalendarStore();
  const days = getMonthDays(currentDate, settings.weekStartsOn);
  const weekdayNames = getWeekdayNames(settings.weekStartsOn);

  const getDayEvents = (date: Date) => {
    return getEventsByDate(date);
  };

  const getEventColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6750A4';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            周{day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((date, index) => {
          const isCurrentMonth = isDateInMonth(date, currentDate);
          const isToday = isDateToday(date);
          const isSelected = isDateSelected(date, selectedDate);
          const dayEvents = getDayEvents(date);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={cn(
                'relative p-2 min-h-[80px] rounded-lg transition-all duration-200 flex flex-col items-start',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                !isCurrentMonth && 'text-gray-300 dark:text-gray-600',
                isSelected && 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20',
                isToday && !isSelected && 'bg-blue-50 dark:bg-blue-900/20'
              )}
            >
              <span
                className={cn(
                  'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                  isToday
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {formatDate(date, 'd')}
              </span>

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 w-full">
                  {dayEvents.slice(0, 4).map((event, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getEventColor(event.calendarId) }}
                    />
                  ))}
                  {dayEvents.length > 4 && (
                    <span className="text-xs text-gray-400">+</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
