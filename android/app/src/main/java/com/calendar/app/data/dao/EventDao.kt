package com.calendar.app.data.dao

import androidx.room.*
import com.calendar.app.data.entity.Event
import kotlinx.coroutines.flow.Flow

@Dao
interface EventDao {
    
    @Query("SELECT * FROM events WHERE calendarId = :calendarId ORDER BY startTime ASC")
    fun getEventsByCalendar(calendarId: String): Flow<List<Event>>
    
    @Query("SELECT * FROM events WHERE startTime >= :startTime AND startTime < :endTime ORDER BY startTime ASC")
    fun getEventsByDateRange(startTime: Long, endTime: Long): Flow<List<Event>>
    
    @Query("SELECT * FROM events WHERE id = :id")
    suspend fun getEventById(id: String): Event?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: Event)
    
    @Update
    suspend fun updateEvent(event: Event)
    
    @Delete
    suspend fun deleteEvent(event: Event)
}
