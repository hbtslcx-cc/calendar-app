import { useCalendarStore } from '@/store/calendarStore';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { Clock, MapPin, AlignLeft } from 'lucide-react';

export function DayView() {
  const { currentDate, selectedDate, setSelectedDate, settings, getEventsByDate, calendars, tags } = useCalendarStore();
  const displayDate = selectedDate || currentDate;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = getEventsByDate(displayDate);

  const getEventColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6750A4';
  };

  const getTagById = (tagId: string) => {
    return tags.find(t => t.id === tagId);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(displayDate, 'EEEE')}
          </div>
          <div className={cn(
            "text-3xl font-bold mt-1 w-12 h-12 mx-auto flex items-center justify-center rounded-full",
            new Date().toDateString() === displayDate.toDateString()
              ? "bg-purple-600 text-white"
              : "text-gray-800 dark:text-gray-200"
          )}>
            {formatDate(displayDate, 'd')}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mt-1">
            {formatDate(displayDate, 'yyyy年M月')}
          </div>
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex border-b border-gray-100 dark:border-gray-800 min-h-[64px]"
            >
              <div className="w-16 text-xs text-gray-400 text-right pr-3 pt-2 flex-shrink-0">
                {formatTime(new Date().setHours(hour, 0), settings.timeFormat === '24h')}
              </div>
              <div className="flex-1 relative"></div>
            </div>
          ))}

          {/* Events */}
          {dayEvents.map((event, index) => {
            const startHour = new Date(event.startTime).getHours();
            const startMinute = new Date(event.startTime).getMinutes();
            const endHour = new Date(event.endTime).getHours();
            const endMinute = new Date(event.endTime).getMinutes();

            const top = startHour * 64 + (startMinute / 60) * 64;
            const height = ((endHour - startHour) * 64) + ((endMinute - startMinute) / 60) * 64;

            return (
              <div
                key={index}
                className="absolute left-20 right-4 rounded-lg p-3 text-white cursor-pointer hover:opacity-90 transition-all shadow-md"
                style={{
                  top: `${top}px`,
                  height: `${Math.max(height, 48)}px`,
                  backgroundColor: getEventColor(event.calendarId),
                }}
              >
                <div className="font-semibold text-sm">{event.title}</div>
                <div className="text-white/80 text-xs mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(event.startTime, settings.timeFormat === '24h')} - 
                  {formatTime(event.endTime, settings.timeFormat === '24h')}
                </div>
                {event.location && height > 60 && (
                  <div className="text-white/80 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                )}
                {event.tagIds.length > 0 && height > 80 && (
                  <div className="flex gap-1 mt-2">
                    {event.tagIds.map(tagId => {
                      const tag = getTagById(tagId);
                      return tag ? (
                        <span
                          key={tagId}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/20"
                        >
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
