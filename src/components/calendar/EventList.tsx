import { useCalendarStore } from '@/store/calendarStore';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { Clock, MapPin, Calendar as CalendarIcon, Trash2, Edit2 } from 'lucide-react';
import type { Event } from '@/types/calendar';

interface EventListProps {
  onEditEvent: (event: Event) => void;
}

export function EventList({ onEditEvent }: EventListProps) {
  const { selectedDate, getEventsByDate, calendars, tags, deleteEvent } = useCalendarStore();
  const events = getEventsByDate(selectedDate);

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6750A4';
  };

  const getTagById = (tagId: string) => {
    return tags.find(t => t.id === tagId);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('确定要删除这个事件吗？')) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {formatDate(selectedDate, 'yyyy年M月d日')}
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {events.length} 个事件
        </span>
      </div>

      {/* Event list */}
      <div className="max-h-[300px] overflow-y-auto">
        {events.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>今天没有事件</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Color indicator */}
                  <div
                    className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCalendarColor(event.calendarId) }}
                  />

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {event.title}
                    </h4>

                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.isAllDay ? (
                          '全天'
                        ) : (
                          <>
                            {formatTime(event.startTime, true)} - {formatTime(event.endTime, true)}
                          </>
                        )}
                      </span>

                      {event.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {event.tagIds.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {event.tagIds.map(tagId => {
                          const tag = getTagById(tagId);
                          return tag ? (
                            <span
                              key={tagId}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                              }}
                            >
                              {tag.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditEvent(event)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
