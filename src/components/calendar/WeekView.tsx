import { useCalendarStore } from '@/store/calendarStore';
import { getWeekDays, getWeekdayNames, isDateToday, isDateSelected, formatDate, formatTime } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

export function WeekView() {
  const { currentDate, selectedDate, setSelectedDate, settings, getEventsByDate, calendars } = useCalendarStore();
  const days = getWeekDays(currentDate, settings.weekStartsOn);
  const weekdayNames = getWeekdayNames(settings.weekStartsOn);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getDayEvents = (date: Date) => {
    return getEventsByDate(date);
  };

  const getEventColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6750A4';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 gap-1 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2"></div>
        {days.map((date, index) => {
          const isToday = isDateToday(date);
          const isSelected = isDateSelected(date, selectedDate);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={cn(
                'p-2 text-center rounded-lg transition-all',
                isSelected && 'bg-purple-100 dark:bg-purple-900/30',
                !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">周{weekdayNames[index]}</div>
              <div
                className={cn(
                  'text-lg font-medium mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full',
                  isToday
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {formatDate(date, 'd')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {/* Time labels */}
          <div className="sticky left-0 bg-white dark:bg-gray-900">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-right pr-2 pt-1"
              >
                {formatTime(new Date().setHours(hour, 0), settings.timeFormat === '24h')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((date, dayIndex) => {
            const dayEvents = getDayEvents(date);

            return (
              <div
                key={dayIndex}
                className="relative border-l border-gray-100 dark:border-gray-800"
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-gray-100 dark:border-gray-800"
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event, eventIndex) => {
                  const startHour = new Date(event.startTime).getHours();
                  const startMinute = new Date(event.startTime).getMinutes();
                  const endHour = new Date(event.endTime).getHours();
                  const endMinute = new Date(event.endTime).getMinutes();

                  const top = startHour * 64 + (startMinute / 60) * 64;
                  const height = ((endHour - startHour) * 64) + ((endMinute - startMinute) / 60) * 64;

                  return (
                    <div
                      key={eventIndex}
                      className="absolute left-1 right-1 rounded px-2 py-1 text-xs text-white overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 20)}px`,
                        backgroundColor: getEventColor(event.calendarId),
                      }}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {height > 30 && (
                        <div className="text-white/80 truncate">
                          {formatTime(event.startTime, settings.timeFormat === '24h')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
