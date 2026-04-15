package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "calendars",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["accountId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class Calendar(
    @PrimaryKey
    val id: String,
    
    val name: String,
    
    val color: String = "#6750A4",
    
    val isVisible: Boolean = true,
    
    val isLocal: Boolean = true,
    
    val accountId: String? = null,
    
    val createdAt: Long,
    
    val updatedAt: Long
)
