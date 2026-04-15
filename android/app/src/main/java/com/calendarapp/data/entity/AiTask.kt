package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "ai_tasks",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class AiTask(
    @PrimaryKey
    val id: String,
    
    val userId: String? = null,
    
    val taskType: String,
    
    val taskParams: String,
    
    val aiResponse: String? = null,
    
    val status: String = "pending",
    
    val createdAt: Long,
    
    val completedAt: Long? = null
)
