import { useState } from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import { cn } from '@/lib/utils';
import { X, Plus, Clock, Bell, Repeat, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface AlarmProps {
  onBack: () => void;
}

interface AlarmEditorProps {
  alarm?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AlarmEditor({ alarm, isOpen, onClose }: AlarmEditorProps) {
  const { addAlarm, updateAlarm, settings } = useCalendarStore();
  const [hour, setHour] = useState(alarm?.hour || 7);
  const [minute, setMinute] = useState(alarm?.minute || 0);
  const [label, setLabel] = useState(alarm?.label || '');
  const [repeatType, setRepeatType] = useState(alarm?.repeatType || 'once');
  const [repeatDays, setRepeatDays] = useState(alarm?.repeatDays || []);
  const [vibrationEnabled, setVibrationEnabled] = useState(alarm?.vibrationEnabled ?? settings.alarmSettings.defaultVibration);
  const [snoozeEnabled, setSnoozeEnabled] = useState(alarm?.snoozeEnabled ?? true);
  const [snoozeMinutes, setSnoozeMinutes] = useState(alarm?.snoozeMinutes ?? settings.alarmSettings.defaultSnoozeMinutes);
  const [snoozeCount, setSnoozeCount] = useState(alarm?.snoozeCount ?? settings.alarmSettings.defaultSnoozeCount);

  const handleSubmit = () => {
    const alarmData = {
      hour,
      minute,
      label: label.trim() || undefined,
      isEnabled: true,
      repeatType,
      repeatDays,
      vibrationEnabled,
      snoozeEnabled,
      snoozeMinutes,
      snoozeCount,
    };

    if (alarm) {
      updateAlarm(alarm.id, alarmData);
    } else {
      addAlarm(alarmData);
    }

    onClose();
  };

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {alarm ? '编辑闹钟' : '新建闹钟'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Time Picker */}
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setHour((prev) => (prev - 1 + 24) % 24)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <input
                type="number"
                min="0"
                max="23"
                value={hour.toString().padStart(2, '0')}
                onChange={(e) => setHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))} 
                className="w-16 text-3xl font-bold text-center bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => setHour((prev) => (prev + 1) % 24)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setMinute((prev) => (prev - 1 + 60) % 60)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <input
                type="number"
                min="0"
                max="59"
                value={minute.toString().padStart(2, '0')}
                onChange={(e) => setMinute(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))} 
                className="w-16 text-3xl font-bold text-center bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => setMinute((prev) => (prev + 1) % 60)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Label */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="添加标签（可选）"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Repeat */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">重复</label>
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="once">仅一次</option>
              <option value="daily">每天</option>
              <option value="weekdays">工作日</option>
              <option value="weekends">周末</option>
              <option value="custom">自定义</option>
            </select>

            {repeatType === 'custom' && (
              <div className="flex flex-wrap gap-2 mt-3">
                {weekDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setRepeatDays((prev) =>
                      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
                    )}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm transition-colors',
                      repeatDays.includes(index)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">震动</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Snooze */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">贪睡</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={snoozeEnabled}
                  onChange={(e) => setSnoozeEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {snoozeEnabled && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">贪睡间隔（分钟）</label>
                  <select
                    value={snoozeMinutes}
                    onChange={(e) => setSnoozeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {[5, 10, 15, 30].map((min) => (
                      <option key={min} value={min}>{min}分钟</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">贪睡次数</label>
                  <select
                    value={snoozeCount}
                    onChange={(e) => setSnoozeCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {[1, 3, 5, 99].map((count) => (
                      <option key={count} value={count}>{count === 99 ? '无限' : count}次</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {alarm ? '保存' : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Alarm({ onBack }: AlarmProps) {
  const { alarms, deleteAlarm, toggleAlarm, alarmLogs } = useCalendarStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<any>(null);

  const handleEditAlarm = (alarm: any) => {
    setEditingAlarm(alarm);
    setIsEditorOpen(true);
  };

  const handleCreateAlarm = () => {
    setEditingAlarm(null);
    setIsEditorOpen(true);
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getRepeatText = (alarm: any) => {
    switch (alarm.repeatType) {
      case 'once':
        return '仅一次';
      case 'daily':
        return '每天';
      case 'weekdays':
        return '工作日';
      case 'weekends':
        return '周末';
      case 'custom':
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        return alarm.repeatDays.map((day: number) => weekDays[day]).join('、');
      default:
        return '';
    }
  };

  const getAlarmStats = () => {
    const totalAlarms = alarms.length;
    const enabledAlarms = alarms.filter((alarm) => alarm.isEnabled).length;
    const totalLogs = alarmLogs.length;
    const snoozeCount = alarmLogs.filter((log) => log.action === 'snooze').length;

    return { totalAlarms, enabledAlarms, totalLogs, snoozeCount };
  };

  const stats = getAlarmStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">闹钟</h1>
        <button
          onClick={handleCreateAlarm}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">总闹钟数</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalAlarms}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">已启用</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.enabledAlarms}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">响铃次数</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalLogs}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">贪睡次数</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.snoozeCount}</div>
        </div>
      </div>

      {/* Alarm List */}
      <div className="flex-1 overflow-y-auto p-4">
        {alarms.length > 0 ? (
          <div className="space-y-3">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {formatTime(alarm.hour, alarm.minute)}
                      </span>
                    </div>
                    {alarm.label && (
                      <div className="flex items-center gap-2 mt-1">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {alarm.label}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Repeat className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getRepeatText(alarm)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alarm.isEnabled}
                        onChange={() => toggleAlarm(alarm.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <button
                      onClick={() => handleEditAlarm(alarm)}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              暂无闹钟，点击右上角添加
            </p>
          </div>
        )}
      </div>

      {/* Alarm Editor */}
      <AlarmEditor
        alarm={editingAlarm}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}
