package com.calendar.app.data.dao

import androidx.room.*
import com.calendar.app.data.entity.SavedCity
import com.calendar.app.data.entity.UserWeatherSettings
import com.calendar.app.data.entity.WeatherCache
import kotlinx.coroutines.flow.Flow

@Dao
interface WeatherDao {
    
    @Query("SELECT * FROM weather_cache WHERE id = :id")
    suspend fun getWeatherCacheById(id: String): WeatherCache?
    
    @Query("SELECT * FROM weather_cache WHERE cityName = :cityName ORDER BY updatedAt DESC LIMIT 1")
    suspend fun getWeatherCacheByCity(cityName: String): WeatherCache?
    
    @Query("SELECT * FROM weather_cache WHERE latitude = :latitude AND longitude = :longitude ORDER BY updatedAt DESC LIMIT 1")
    suspend fun getWeatherCacheByLocation(latitude: Double, longitude: Double): WeatherCache?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWeatherCache(weatherCache: WeatherCache)
    
    @Update
    suspend fun updateWeatherCache(weatherCache: WeatherCache)
    
    @Delete
    suspend fun deleteWeatherCache(weatherCache: WeatherCache)
    
    @Query("DELETE FROM weather_cache WHERE updatedAt < :timestamp")
    suspend fun deleteOldWeatherCaches(timestamp: Long)
    
    @Query("SELECT * FROM saved_cities WHERE userId = :userId ORDER BY sortOrder ASC")
    fun getSavedCitiesByUser(userId: String): Flow<List<SavedCity>>
    
    @Query("SELECT * FROM saved_cities WHERE userId = :userId AND isDefault = 1 LIMIT 1")
    suspend fun getDefaultCity(userId: String): SavedCity?
    
    @Query("SELECT * FROM saved_cities WHERE id = :cityId")
    suspend fun getSavedCityById(cityId: String): SavedCity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSavedCity(savedCity: SavedCity)
    
    @Update
    suspend fun updateSavedCity(savedCity: SavedCity)
    
    @Delete
    suspend fun deleteSavedCity(savedCity: SavedCity)
    
    @Query("UPDATE saved_cities SET isDefault = 0 WHERE userId = :userId")
    suspend fun clearDefaultCity(userId: String)
    
    @Query("SELECT * FROM user_weather_settings WHERE userId = :userId")
    suspend fun getUserWeatherSettings(userId: String): UserWeatherSettings?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserWeatherSettings(settings: UserWeatherSettings)
    
    @Update
    suspend fun updateUserWeatherSettings(settings: UserWeatherSettings)
}
