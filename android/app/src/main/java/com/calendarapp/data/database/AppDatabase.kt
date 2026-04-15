package com.calendarapp.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.calendarapp.data.converter.Converters
import com.calendarapp.data.dao.AiTaskDao
import com.calendarapp.data.dao.AlarmDao
import com.calendarapp.data.dao.CalendarDao
import com.calendarapp.data.dao.EventDao
import com.calendarapp.data.dao.ReminderDao
import com.calendarapp.data.dao.TagDao
import com.calendarapp.data.dao.UserDao
import com.calendarapp.data.dao.WeatherDao
import com.calendarapp.data.entity.Alarm
import com.calendarapp.data.entity.AlarmLog
import com.calendarapp.data.entity.Calendar
import com.calendarapp.data.entity.Event
import com.calendarapp.data.entity.EventTag
import com.calendarapp.data.entity.Reminder
import com.calendarapp.data.entity.SavedCity
import com.calendarapp.data.entity.Tag
import com.calendarapp.data.entity.User
import com.calendarapp.data.entity.UserAlarmSettings
import com.calendarapp.data.entity.UserAiSettings
import com.calendarapp.data.entity.UserWeatherSettings
import com.calendarapp.data.entity.WeatherCache
import com.calendarapp.data.entity.AiTask
import com.calendarapp.data.entity.AiTaskHistory

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
