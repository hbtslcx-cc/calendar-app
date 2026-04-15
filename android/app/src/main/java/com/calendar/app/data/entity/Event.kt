package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "events",
    foreignKeys = [
        ForeignKey(
            entity = Calendar::class,
            parentColumns = ["id"],
            childColumns = ["calendarId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = AiTask::class,
            parentColumns = ["id"],
            childColumns = ["aiTaskId"],
            onDelete = ForeignKey.SET_NULL
        )
    ]
)
data class Event(
    @PrimaryKey
    val id: String,
    
    val title: String,
    
    val description: String? = null,
    
    val location: String? = null,
    
    val startTime: Long,
    
    val endTime: Long,
    
    val isAllDay: Boolean = false,
    
    val recurrenceRule: String? = null,
    
    val recurrenceEnd: Long? = null,
    
    val calendarId: String,
    
    val aiTaskId: String? = null,
    
    val createdAt: Long,
    
    val updatedAt: Long
)
