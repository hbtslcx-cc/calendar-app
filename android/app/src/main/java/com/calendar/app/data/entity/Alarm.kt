package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "alarms",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Alarm(
    @PrimaryKey
    val id: String,
    
    val userId: String,
    
    val hour: Int,
    
    val minute: Int,
    
    val label: String? = null,
    
    val isEnabled: Boolean = true,
    
    val repeatType: String = "once",
    
    val repeatDays: String? = null,
    
    val ringtoneUri: String? = null,
    
    val ringtoneName: String? = null,
    
    val vibrationEnabled: Boolean = true,
    
    val snoozeEnabled: Boolean = true,
    
    val snoozeMinutes: Int = 10,
    
    val snoozeCount: Int = 3,
    
    val createdAt: Long,
    
    val updatedAt: Long
)
