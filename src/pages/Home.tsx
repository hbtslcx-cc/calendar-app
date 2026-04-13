import { useState } from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import { Header } from '@/components/Header';
import { MonthView, WeekView, DayView, YearView, EventList, EventEditor } from '@/components/calendar';
import { SearchPanel } from '@/components/SearchPanel';
import { Settings } from './Settings';
import { Plus } from 'lucide-react';
import type { Event } from '@/types/calendar';

export function Home() {
  const { viewMode } = useCalendarStore();
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventEditorOpen(true);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsEventEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEventEditorOpen(false);
    setEditingEvent(null);
  };

  if (isSettingsOpen) {
    return <Settings onBack={() => setIsSettingsOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar View */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {viewMode === 'month' && <MonthView />}
            {viewMode === 'week' && <WeekView />}
            {viewMode === 'day' && <DayView />}
            {viewMode === 'year' && <YearView />}
          </div>
        </div>

        {/* Event List */}
        <div className="px-4 pb-4">
          <EventList onEditEvent={handleEditEvent} />
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={handleCreateEvent}
        className="fixed right-6 bottom-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 hover:scale-105 transition-all flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Event Editor */}
      <EventEditor
        event={editingEvent}
        isOpen={isEventEditorOpen}
        onClose={handleCloseEditor}
      />

      {/* Search Panel */}
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onEditEvent={handleEditEvent}
      />
    </div>
  );
}
