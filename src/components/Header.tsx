import { useCalendarStore } from '@/store/calendarStore';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search, Settings, Cloud, Bell } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  onSettingsClick: () => void;
  onWeatherClick: () => void;
  onAlarmClick: () => void;
}

export function Header({ onSearchClick, onSettingsClick, onWeatherClick, onAlarmClick }: HeaderProps) {
  const { currentDate, viewMode, setViewMode, goToToday, goToPrevious, goToNext, weather } = useCalendarStore();

  const getTitle = () => {
    switch (viewMode) {
      case 'month':
        return formatDate(currentDate, 'yyyy年 M月');
      case 'week':
        return formatDate(currentDate, 'yyyy年 M月');
      case 'day':
        return formatDate(currentDate, 'yyyy年 M月d日');
      case 'year':
        return formatDate(currentDate, 'yyyy年');
      default:
        return '';
    }
  };

  const viewTabs = [
    { key: 'month' as const, label: '月' },
    { key: 'week' as const, label: '周' },
    { key: 'day' as const, label: '日' },
    { key: 'year' as const, label: '年' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {getTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onWeatherClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
          >
            <Cloud className="w-5 h-5" />
            {weather && (
              <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {weather.current.temperature}°
              </span>
            )}
          </button>
          <button
            onClick={onAlarmClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={onSearchClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            今天
          </button>
          <div className="flex items-center">
            <button
              onClick={goToPrevious}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {viewTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                viewMode === tab.key
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
