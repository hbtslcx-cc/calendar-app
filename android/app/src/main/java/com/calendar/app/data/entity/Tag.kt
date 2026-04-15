package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tags")
data class Tag(
    @PrimaryKey
    val id: String,
    
    val name: String,
    
    val color: String = "#6750A4"
)
