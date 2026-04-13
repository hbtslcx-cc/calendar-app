import { useCalendarStore } from '@/store/calendarStore';
import { getYearMonths, formatDate, isDateToday, isDateSelected } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';

export function YearView() {
  const { currentDate, selectedDate, setSelectedDate, setViewMode, settings, getEventsByDate, calendars } = useCalendarStore();
  const months = getYearMonths(currentDate);

  const getMonthDays = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: settings.weekStartsOn });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: settings.weekStartsOn });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const getEventColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6750A4';
  };

  const handleMonthClick = (monthDate: Date) => {
    setSelectedDate(monthDate);
    setViewMode('month');
  };

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
      {months.map((month, monthIndex) => {
        const days = getMonthDays(month);
        const monthEvents = getEventsByDate(month);

        return (
          <div
            key={monthIndex}
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleMonthClick(month)}
          >
            <div className="text-center font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {formatDate(month, 'M月')}
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-gray-400 py-1">{day}</div>
              ))}

              {days.map((date, dayIndex) => {
                const isCurrentMonth = isSameMonth(date, month);
                const isToday = isDateToday(date);
                const isSelected = isDateSelected(date, selectedDate);
                const dayEvents = getEventsByDate(date);

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'py-1 relative',
                      !isCurrentMonth && 'text-gray-300 dark:text-gray-600',
                      isCurrentMonth && 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <span className={cn(
                      'w-6 h-6 mx-auto flex items-center justify-center rounded-full text-xs',
                      isToday && 'bg-purple-600 text-white',
                      isSelected && !isToday && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                    )}>
                      {formatDate(date, 'd')}
                    </span>

                    {/* Event dots */}
                    {dayEvents.length > 0 && (
                      <div className="flex justify-center gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: getEventColor(event.calendarId) }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
