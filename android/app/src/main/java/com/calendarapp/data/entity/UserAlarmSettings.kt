package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "user_alarm_settings",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class UserAlarmSettings(
    @PrimaryKey
    val userId: String,
    
    val defaultRingtoneUri: String? = null,
    
    val defaultRingtoneName: String? = null,
    
    val defaultVibration: Boolean = true,
    
    val defaultSnoozeMinutes: Int = 10,
    
    val defaultSnoozeCount: Int = 3,
    
    val gradualVolume: Boolean = false,
    
    val maxRingDuration: Int = 300,
    
    val ringInSilent: Boolean = false,
    
    val showInNotification: Boolean = true,
    
    val updatedAt: Long
)
