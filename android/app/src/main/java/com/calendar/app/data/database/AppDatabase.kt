package com.calendar.app.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.calendar.app.data.converter.Converters
import com.calendar.app.data.dao.AiTaskDao
import com.calendar.app.data.dao.AlarmDao
import com.calendar.app.data.dao.CalendarDao
import com.calendar.app.data.dao.EventDao
import com.calendar.app.data.dao.ReminderDao
import com.calendar.app.data.dao.TagDao
import com.calendar.app.data.dao.UserDao
import com.calendar.app.data.dao.WeatherDao
import com.calendar.app.data.entity.Alarm
import com.calendar.app.data.entity.AlarmLog
import com.calendar.app.data.entity.Calendar
import com.calendar.app.data.entity.Event
import com.calendar.app.data.entity.EventTag
import com.calendar.app.data.entity.Reminder
import com.calendar.app.data.entity.SavedCity
import com.calendar.app.data.entity.Tag
import com.calendar.app.data.entity.User
import com.calendar.app.data.entity.UserAlarmSettings
import com.calendar.app.data.entity.UserAiSettings
import com.calendar.app.data.entity.UserWeatherSettings
import com.calendar.app.data.entity.WeatherCache
import com.calendar.app.data.entity.AiTask
import com.calendar.app.data.entity.AiTaskHistory

@Database(
    entities = [
        User::class,
        Calendar::class,
        Event::class,
        Reminder::class,
        Tag::class,
        EventTag::class,
        AiTask::class,
        AiTaskHistory::class,
        UserAiSettings::class,
        WeatherCache::class,
        SavedCity::class,
        UserWeatherSettings::class,
        Alarm::class,
        AlarmLog::class,
        UserAlarmSettings::class
    ],
    version = 3,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    
    abstract fun userDao(): UserDao
    abstract fun calendarDao(): CalendarDao
    abstract fun eventDao(): EventDao
    abstract fun reminderDao(): ReminderDao
    abstract fun tagDao(): TagDao
    abstract fun aiTaskDao(): AiTaskDao
    abstract fun weatherDao(): WeatherDao
    abstract fun alarmDao(): AlarmDao
}
