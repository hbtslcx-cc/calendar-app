import { useState, useMemo } from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { Search, X, Filter, Calendar, Clock, MapPin } from 'lucide-react';
import type { Event } from '@/types/calendar';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEditEvent: (event: Event) => void;
}

export function SearchPanel({ isOpen, onClose, onEditEvent }: SearchPanelProps) {
  const { events, calendars, tags, settings } = useCalendarStore();
  const [query, setQuery] = useState('');
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Text search
      const matchesQuery = !query ||
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description?.toLowerCase().includes(query.toLowerCase()) ||
        event.location?.toLowerCase().includes(query.toLowerCase());

      // Calendar filter
      const matchesCalendar = selectedCalendarIds.length === 0 ||
        selectedCalendarIds.includes(event.calendarId);

      // Tag filter
      const matchesTag = selectedTagIds.length === 0 ||
        event.tagIds.some(tagId => selectedTagIds.includes(tagId));

      return matchesQuery && matchesCalendar && matchesTag;
    }).sort((a, b) => b.startTime - a.startTime);
  }, [events, query, selectedCalendarIds, selectedTagIds]);

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.color || '#6750A4';
  };

  const getCalendarName = (calendarId: string) => {
    const calendar = calendars.find(c => c.id === calendarId);
    return calendar?.name || '未知日历';
  };

  const getTagById = (tagId: string) => {
    return tags.find(t => t.id === tagId);
  };

  const toggleCalendar = (calendarId: string) => {
    setSelectedCalendarIds(prev =>
      prev.includes(calendarId)
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCalendarIds([]);
    setSelectedTagIds([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索事件..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2.5 rounded-xl transition-colors',
              showFilters
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            {/* Calendar filters */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日历</h4>
              <div className="flex flex-wrap gap-2">
                {calendars.filter(c => c.isVisible).map(calendar => (
                  <button
                    key={calendar.id}
                    onClick={() => toggleCalendar(calendar.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1.5',
                      selectedCalendarIds.includes(calendar.id)
                        ? 'text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                    )}
                    style={{
                      backgroundColor: selectedCalendarIds.includes(calendar.id) ? calendar.color : undefined,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedCalendarIds.includes(calendar.id) ? 'white' : calendar.color }}
                    />
                    {calendar.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-all',
                      selectedTagIds.includes(tag.id)
                        ? 'text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                    )}
                    style={{
                      backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : undefined,
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>未找到匹配的事件</p>
              {(query || selectedCalendarIds.length > 0 || selectedTagIds.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-purple-600 hover:text-purple-700 text-sm"
                >
                  清除筛选条件
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    onEditEvent(event);
                    onClose();
                  }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Color indicator */}
                    <div
                      className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCalendarColor(event.calendarId) }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate">
                        {event.title}
                      </h4>

                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(new Date(event.startTime), 'yyyy年M月d日')}
                        </span>
                        {!event.isAllDay && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(event.startTime, settings.timeFormat === '24h')}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          {getCalendarName(event.calendarId)}
                        </span>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
          找到 {filteredEvents.length} 个事件
        </div>
      </div>
    </div>
  );
}
