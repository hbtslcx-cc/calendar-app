package com.calendar.app.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(
    tableName = "user_weather_settings",
    foreignKeys = [
        ForeignKey(
            entity = User::class,
            parentColumns = ["id"],
            childColumns = ["userId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = SavedCity::class,
            parentColumns = ["id"],
            childColumns = ["defaultCityId"],
            onDelete = ForeignKey.SET_NULL
        )
    ]
)
data class UserWeatherSettings(
    @PrimaryKey
    val userId: String,
    
    val locationType: String = "gps",
    
    val temperatureUnit: String = "celsius",
    
    val autoUpdate: Boolean = true,
    
    val updateFrequency: Int = 180,
    
    val showCityName: Boolean = true,
    
    val showAirQuality: Boolean = true,
    
    val showLifeIndex: Boolean = true,
    
    val weatherNotification: Boolean = true,
    
    val defaultCityId: String? = null,
    
    val updatedAt: Long
)
