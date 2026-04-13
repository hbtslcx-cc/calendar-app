import { useCalendarStore } from '@/store/calendarStore';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Bell,
  Volume2,
  Vibrate,
  Calendar,
  Clock,
  Palette,
  Download,
  Upload,
  Trash2,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
  onBack: () => void;
}

const COLOR_OPTIONS = [
  '#6750A4', '#4CAF50', '#2196F3', '#FF9800', '#F44336',
  '#9C27B0', '#00BCD4', '#FFEB3B', '#795548', '#607D8B',
];

export function Settings({ onBack }: SettingsProps) {
  const { settings, updateSettings, calendars, addCalendar, updateCalendar, deleteCalendar, toggleCalendarVisibility, events, tags } = useCalendarStore();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'calendars' | 'data'>('appearance');
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarColor, setNewCalendarColor] = useState(COLOR_OPTIONS[0]);
  const [showAddCalendar, setShowAddCalendar] = useState(false);

  const handleExport = () => {
    const data = {
      calendars,
      events,
      tags,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        // TODO: Implement import logic
        alert('导入功能开发中...');
      } catch {
        alert('文件格式错误');
      }
    };
    reader.readAsText(file);
  };

  const handleAddCalendar = () => {
    if (!newCalendarName.trim()) return;
    addCalendar({
      name: newCalendarName.trim(),
      color: newCalendarColor,
      isVisible: true,
      isLocal: true,
    });
    setNewCalendarName('');
    setShowAddCalendar(false);
  };

  const tabs = [
    { key: 'appearance' as const, label: '外观', icon: Palette },
    { key: 'notifications' as const, label: '提醒', icon: Bell },
    { key: 'calendars' as const, label: '日历', icon: Calendar },
    { key: 'data' as const, label: '数据', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">设置</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
              activeTab === tab.key
                ? 'text-purple-600 border-purple-600'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Theme */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">主题</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'light', label: '浅色', icon: Sun },
                  { key: 'dark', label: '深色', icon: Moon },
                  { key: 'system', label: '跟随系统', icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => updateSettings({ theme: option.key as typeof settings.theme })}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      settings.theme === option.key
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    )}
                  >
                    <option.icon className={cn(
                      'w-6 h-6',
                      settings.theme === option.key ? 'text-purple-600' : 'text-gray-400'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      settings.theme === option.key ? 'text-purple-600' : 'text-gray-600 dark:text-gray-400'
                    )}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Primary Color */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">主题色</h2>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSettings({ primaryColor: color })}
                    className={cn(
                      'w-10 h-10 rounded-full transition-all',
                      settings.primaryColor === color
                        ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                        : 'hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {settings.primaryColor === color && (
                      <Check className="w-5 h-5 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Time Format */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">时间格式</h2>
              <div className="flex gap-3">
                {[
                  { key: '12h', label: '12小时制' },
                  { key: '24h', label: '24小时制' },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => updateSettings({ timeFormat: option.key as typeof settings.timeFormat })}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl border-2 transition-all',
                      settings.timeFormat === option.key
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">默认提醒</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 0, label: '准时' },
                  { value: 5, label: '5分钟前' },
                  { value: 15, label: '15分钟前' },
                  { value: 30, label: '30分钟前' },
                  { value: 60, label: '1小时前' },
                  { value: 1440, label: '1天前' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateSettings({ defaultReminderMinutes: option.value })}
                    className={cn(
                      'py-3 px-4 rounded-xl border-2 transition-all',
                      settings.defaultReminderMinutes === option.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">提醒声音</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reminderSound}
                    onChange={(e) => updateSettings({ reminderSound: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">震动提醒</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reminderVibration}
                    onChange={(e) => updateSettings({ reminderVibration: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </section>
          </div>
        )}

        {/* Calendars */}
        {activeTab === 'calendars' && (
          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">我的日历</h2>
                <button
                  onClick={() => setShowAddCalendar(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  新建
                </button>
              </div>

              {/* Add calendar form */}
              {showAddCalendar && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <input
                    type="text"
                    placeholder="日历名称"
                    value={newCalendarName}
                    onChange={(e) => setNewCalendarName(e.target.value)}
                    className="w-full px-3 py-2 mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCalendarColor(color)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-all',
                          newCalendarColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCalendar}
                      className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                    >
                      创建
                    </button>
                    <button
                      onClick={() => setShowAddCalendar(false)}
                      className="flex-1 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {/* Calendar list */}
              <div className="space-y-2">
                {calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: calendar.color }}
                      />
                      <span className="text-gray-800 dark:text-gray-200">{calendar.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={calendar.isVisible}
                          onChange={() => toggleCalendarVisibility(calendar.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-purple-600"></div>
                      </label>
                      {!calendar.isLocal && (
                        <button
                          onClick={() => deleteCalendar(calendar.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Data */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">数据管理</h2>
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-200">导出数据</div>
                    <div className="text-sm text-gray-500">将所有日历数据导出为JSON文件</div>
                  </div>
                </button>

                <label className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-800 dark:text-gray-200">导入数据</div>
                    <div className="text-sm text-gray-500">从JSON文件导入日历数据</div>
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">统计</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{events.length}</div>
                  <div className="text-sm text-gray-500">事件</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{calendars.length}</div>
                  <div className="text-sm text-gray-500">日历</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{tags.length}</div>
                  <div className="text-sm text-gray-500">标签</div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
