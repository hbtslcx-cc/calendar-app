package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "alarm_logs",
    foreignKeys = [
        ForeignKey(
            entity = Alarm::class,
            parentColumns = ["id"],
            childColumns = ["alarmId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class AlarmLog(
    @PrimaryKey
    val id: String,
    
    val alarmId: String,
    
    val triggerTime: Long,
    
    val stopTime: Long? = null,
    
    val snoozeCount: Int = 0,
    
    val action: String,
    
    val createdAt: Long
)
