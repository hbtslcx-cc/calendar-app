package com.calendarapp.data.dao

import androidx.room.*
import com.calendarapp.data.entity.Alarm
import com.calendarapp.data.entity.AlarmLog
import com.calendarapp.data.entity.UserAlarmSettings
import kotlinx.coroutines.flow.Flow

@Dao
interface AlarmDao {
    
    @Query("SELECT * FROM alarms WHERE userId = :userId ORDER BY hour ASC, minute ASC")
    fun getAllAlarmsByUser(userId: String): Flow<List<Alarm>>
    
    @Query("SELECT * FROM alarms WHERE userId = :userId AND isEnabled = 1 ORDER BY hour ASC, minute ASC")
    fun getEnabledAlarmsByUser(userId: String): Flow<List<Alarm>>
    
    @Query("SELECT * FROM alarms WHERE id = :id")
    suspend fun getAlarmById(id: String): Alarm?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAlarm(alarm: Alarm): Long
    
    @Update
    suspend fun updateAlarm(alarm: Alarm)
    
    @Delete
    suspend fun deleteAlarm(alarm: Alarm)
    
    @Query("UPDATE alarms SET isEnabled = :isEnabled WHERE id = :alarmId")
    suspend fun updateAlarmEnabled(alarmId: String, isEnabled: Boolean)
    
    @Query("SELECT * FROM alarm_logs WHERE alarmId = :alarmId ORDER BY createdAt DESC LIMIT :limit")
    fun getAlarmLogs(alarmId: String, limit: Int = 50): Flow<List<AlarmLog>>
    
    @Query("SELECT * FROM alarm_logs WHERE alarmId = :alarmId ORDER BY createdAt DESC LIMIT :limit")
    suspend fun getAlarmLogsSync(alarmId: String, limit: Int = 50): List<AlarmLog>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAlarmLog(alarmLog: AlarmLog)
    
    @Query("DELETE FROM alarm_logs WHERE alarmId = :alarmId")
    suspend fun deleteAlarmLogs(alarmId: String)
    
    @Query("DELETE FROM alarm_logs WHERE createdAt < :timestamp")
    suspend fun deleteOldAlarmLogs(timestamp: Long)
    
    @Query("SELECT COUNT(*) FROM alarm_logs WHERE alarmId = :alarmId AND action = 'stop' AND createdAt >= :startTime AND createdAt <= :endTime")
    suspend fun getAlarmTriggerCount(alarmId: String, startTime: Long, endTime: Long): Int
    
    @Query("SELECT COUNT(*) FROM alarm_logs WHERE alarmId = :alarmId AND action = 'snooze' AND createdAt >= :startTime AND createdAt <= :endTime")
    suspend fun getAlarmSnoozeCount(alarmId: String, startTime: Long, endTime: Long): Int
    
    @Query("SELECT * FROM user_alarm_settings WHERE userId = :userId")
    suspend fun getUserAlarmSettings(userId: String): UserAlarmSettings?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserAlarmSettings(settings: UserAlarmSettings)
    
    @Update
    suspend fun updateUserAlarmSettings(settings: UserAlarmSettings)
}
