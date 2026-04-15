package com.calendar.app.data.dao

import androidx.room.*
import com.calendar.app.data.entity.Calendar
import kotlinx.coroutines.flow.Flow

@Dao
interface CalendarDao {
    
    @Query("SELECT * FROM calendars WHERE accountId = :accountId ORDER BY createdAt DESC")
    fun getCalendarsByAccount(accountId: String?): Flow<List<Calendar>>
    
    @Query("SELECT * FROM calendars WHERE id = :id")
    suspend fun getCalendarById(id: String): Calendar?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCalendar(calendar: Calendar)
    
    @Update
    suspend fun updateCalendar(calendar: Calendar)
    
    @Delete
    suspend fun deleteCalendar(calendar: Calendar)
}
