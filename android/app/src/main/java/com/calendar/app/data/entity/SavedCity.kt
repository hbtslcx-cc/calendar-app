package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "saved_cities",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        )
    ]
)
data class SavedCity(
    @PrimaryKey
    val id: String,
    
    val userId: String,
    
    val cityName: String,
    
    val countryName: String? = null,
    
    val latitude: Double,
    
    val longitude: Double,
    
    val isDefault: Boolean = false,
    
    val sortOrder: Int = 0,
    
    val createdAt: Long
)
