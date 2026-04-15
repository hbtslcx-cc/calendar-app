import { useState, useEffect } from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import { cn } from '@/lib/utils';
import { X, RefreshCw, MapPin, Plus, Trash2, Sun, Cloud, CloudRain, Snowflake, Wind, Droplets, Thermometer, Barometer, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface WeatherProps {
  onBack: () => void;
}

export function Weather({ onBack }: WeatherProps) {
  const { weather, savedCities, addSavedCity, deleteSavedCity, setDefaultCity, updateWeather, settings } = useCalendarStore();
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCity = async () => {
    if (!newCityName.trim()) return;
    
    setIsLoading(true);
    try {
      // 模拟天气API调用
      const mockWeather = {
        id: `city_${Date.now()}`,
        cityName: newCityName.trim(),
        latitude: 39.9042,
        longitude: 116.4074,
        current: {
          temperature: 22,
          humidity: 45,
          windSpeed: 3.5,
          weather: '晴',
          icon: 'sunny',
          lastUpdated: Date.now(),
        },
        forecast7d: Array.from({ length: 7 }, (_, i) => ({
          date: Date.now() + i * 24 * 60 * 60 * 1000,
          temperatureMax: 22 + i,
          temperatureMin: 15 + i,
          weather: i % 2 === 0 ? '晴' : '多云',
          icon: i % 2 === 0 ? 'sunny' : 'cloudy',
        })),
        forecast24h: Array.from({ length: 24 }, (_, i) => ({
          time: Date.now() + i * 60 * 60 * 1000,
          temperature: 18 + i % 8,
          weather: i % 3 === 0 ? '晴' : i % 3 === 1 ? '多云' : '小雨',
          icon: i % 3 === 0 ? 'sunny' : i % 3 === 1 ? 'cloudy' : 'rainy',
        })),
      };

      const cityId = addSavedCity({
        cityName: newCityName.trim(),
        latitude: mockWeather.latitude,
        longitude: mockWeather.longitude,
        isDefault: savedCities.length === 0,
        sortOrder: savedCities.length,
      });

      updateWeather(mockWeather);
      setNewCityName('');
      setIsAddCityOpen(false);
    } catch (error) {
      console.error('添加城市失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCity = (cityId: string) => {
    deleteSavedCity(cityId);
  };

  const handleSetDefaultCity = (cityId: string) => {
    setDefaultCity(cityId);
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'snowy':
        return <Snowflake className="w-8 h-8 text-blue-200" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

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
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">天气详情</h1>
        <button
          onClick={() => setIsAddCityOpen(!isAddCityOpen)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add City Form */}
      {isAddCityOpen && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="输入城市名称"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleAddCity}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? '添加中...' : '添加'}
            </button>
          </div>
        </div>
      )}

      {/* Saved Cities */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">已保存的城市</h2>
        <div className="space-y-2">
          {savedCities.map((city) => (
            <div
              key={city.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg transition-colors',
                city.isDefault
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {city.cityName}
                </span>
                {city.isDefault && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                    默认
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!city.isDefault && (
                  <button
                    onClick={() => handleSetDefaultCity(city.id)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCity(city.id)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {savedCities.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              暂无保存的城市，点击右上角添加
            </div>
          )}
        </div>
      </div>

      {/* Weather Details */}
      <div className="flex-1 overflow-y-auto p-4">
        {weather ? (
          <div className="space-y-6">
            {/* Current Weather */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {weather.cityName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    最后更新: {new Date(weather.current.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-5xl font-light text-gray-800 dark:text-gray-200">
                  {weather.current.temperature}°{settings.weatherSettings.temperatureUnit === 'celsius' ? 'C' : 'F'}
                </div>
                <div className="text-4xl">
                  {getWeatherIcon(weather.current.icon)}
                </div>
              </div>

              <div className="mt-4 text-center text-lg font-medium text-gray-700 dark:text-gray-300">
                {weather.current.weather}
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    湿度: {weather.current.humidity}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    风速: {weather.current.windSpeed} m/s
                  </span>
                </div>
              </div>
            </div>

            {/* 7 Day Forecast */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">7天预报</h3>
              <div className="space-y-3">
                {weather.forecast7d?.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(day.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                    </span>
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(day.icon)}
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {day.weather}
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {day.temperatureMax}° / {day.temperatureMin}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 24 Hour Forecast */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">24小时预报</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2">
                  {weather.forecast24h?.map((hour, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[60px]">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(hour.time).getHours()}:00
                      </span>
                      <div className="my-2">
                        {getWeatherIcon(hour.icon)}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {hour.temperature}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <MapPin className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              请添加城市以查看天气信息
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
