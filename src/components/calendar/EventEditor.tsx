import { useState, useEffect } from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { X, Clock, MapPin, Tag, Calendar, Bell, Repeat } from 'lucide-react';
import type { Event } from '@/types/calendar';

interface EventEditorProps {
  event?: Event | null;
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

const REMINDER_OPTIONS = [
  { value: 0, label: '准时' },
  { value: 5, label: '5分钟前' },
  { value: 15, label: '15分钟前' },
  { value: 30, label: '30分钟前' },
  { value: 60, label: '1小时前' },
  { value: 1440, label: '1天前' },
];

const RECURRENCE_OPTIONS = [
  { value: '', label: '不重复' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
  { value: 'yearly', label: '每年' },
];

export function EventEditor({ event, isOpen, onClose, initialDate }: EventEditorProps) {
  const { calendars, tags, addEvent, updateEvent, selectedDate, settings } = useCalendarStore();
  const isEditing = !!event;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [calendarId, setCalendarId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [reminderMinutes, setReminderMinutes] = useState(settings.defaultReminderMinutes);
  const [recurrenceRule, setRecurrenceRule] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode
        setTitle(event.title);
        setDescription(event.description || '');
        setLocation(event.location || '');
        setIsAllDay(event.isAllDay);
        setStartDate(formatDate(new Date(event.startTime), 'yyyy-MM-dd'));
        setStartTime(formatDate(new Date(event.startTime), 'HH:mm'));
        setEndDate(formatDate(new Date(event.endTime), 'yyyy-MM-dd'));
        setEndTime(formatDate(new Date(event.endTime), 'HH:mm'));
        setCalendarId(event.calendarId);
        setSelectedTagIds(event.tagIds);
        setRecurrenceRule(event.recurrenceRule || '');
      } else {
        // Create mode
        const baseDate = initialDate || selectedDate;
        setTitle('');
        setDescription('');
        setLocation('');
        setIsAllDay(false);
        setStartDate(formatDate(baseDate, 'yyyy-MM-dd'));
        setStartTime('09:00');
        setEndDate(formatDate(baseDate, 'yyyy-MM-dd'));
        setEndTime('10:00');
        setCalendarId(calendars[0]?.id || '');
        setSelectedTagIds([]);
        setReminderMinutes(settings.defaultReminderMinutes);
        setRecurrenceRule('');
      }
    }
  }, [isOpen, event, initialDate, selectedDate, calendars, settings.defaultReminderMinutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const startDateTime = new Date(`${startDate}T${isAllDay ? '00:00' : startTime}`);
    const endDateTime = new Date(`${endDate}T${isAllDay ? '23:59' : endTime}`);

    const eventData = {
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      startTime: startDateTime.getTime(),
      endTime: endDateTime.getTime(),
      isAllDay,
      recurrenceRule: recurrenceRule || undefined,
      calendarId,
      tagIds: selectedTagIds,
    };

    if (isEditing && event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {isEditing ? '编辑事件' : '新建事件'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="事件标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-medium bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none py-2 text-gray-800 dark:text-gray-200 placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* All day toggle */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">全天事件</span>
            </label>
          </div>

          {/* Date/Time */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="添加地点"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Calendar selection */}
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {calendars.filter(c => c.isVisible).map(calendar => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reminder */}
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {REMINDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}提醒
                </option>
              ))}
            </select>
          </div>

          {/* Recurrence */}
          <div className="flex items-center gap-3 mb-4">
            <Repeat className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={recurrenceRule}
              onChange={(e) => setRecurrenceRule(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {RECURRENCE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="flex items-start gap-3 mb-4">
            <Tag className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
            <div className="flex-1 flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-all',
                    selectedTagIds.includes(tag.id)
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
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

          {/* Description */}
          <div className="mb-4">
            <textarea
              placeholder="添加备注..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isEditing ? '保存' : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
}
