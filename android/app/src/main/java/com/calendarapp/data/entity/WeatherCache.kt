package com.calendarapp.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "weather_cache")
data class WeatherCache(
    @PrimaryKey
    val id: String,
    
    val cityName: String,
    
    val latitude: Double,
    
    val longitude: Double,
    
    val currentWeather: String? = null,
    
    val forecast7d: String? = null,
    
    val forecast24h: String? = null,
    
    val airQuality: String? = null,
    
    val lifeIndex: String? = null,
    
    val createdAt: Long,
    
    val updatedAt: Long
)
