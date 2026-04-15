package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class User(
    @PrimaryKey
    val id: String,
    
    val name: String? = null,
    
    val email: String? = null,
    
    val isPremium: Boolean = false,
    
    val createdAt: Long,
    
    val updatedAt: Long
)
