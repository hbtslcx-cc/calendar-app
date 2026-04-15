package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "user_ai_settings",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class UserAiSettings(
    @PrimaryKey
    val userId: String,
    
    val apiProvider: String = "openai",
    
    val apiKeyEncrypted: String? = null,
    
    val modelName: String = "gpt-4",
    
    val enableWebSearch: Boolean = true,
    
    val enableHistory: Boolean = true,
    
    val maxTokens: Int = 2000,
    
    val temperature: Float = 0.7f,
    
    val updatedAt: Long
)
