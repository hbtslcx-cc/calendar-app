package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "reminders",
    foreignKeys = [
        ForeignKey(
            entity = Event::class,
            parentColumns = ["id"],
            childColumns = ["eventId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Reminder(
    @PrimaryKey
    val id: String,
    
    val eventId: String,
    
    val minutesBefore: Int = 15,
    
    val reminderType: String = "notification",
    
    val isEnabled: Boolean = true
)
