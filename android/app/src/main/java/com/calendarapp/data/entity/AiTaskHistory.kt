package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "ai_task_history",
    foreignKeys = [
        ForeignKey(
            entity = AiTask::class,
            parentColumns = ["id"],
            childColumns = ["taskId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = Event::class,
            parentColumns = ["id"],
            childColumns = ["eventId"],
            onDelete = ForeignKey.SET_NULL
        )
    ]
)
data class AiTaskHistory(
    @PrimaryKey
    val id: String,
    
    val taskId: String,
    
    val eventId: String? = null,
    
    val action: String,
    
    val actionData: String? = null,
    
    val createdAt: Long
)
