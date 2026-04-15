package com.calendar.app.data.dao

import androidx.room.*
import com.calendar.app.data.entity.AiTask
import com.calendar.app.data.entity.AiTaskHistory
import com.calendar.app.data.entity.UserAiSettings
import kotlinx.coroutines.flow.Flow

@Dao
interface AiTaskDao {
    
    @Query("SELECT * FROM ai_tasks WHERE userId = :userId ORDER BY createdAt DESC")
    fun getAiTasksByUser(userId: String?): Flow<List<AiTask>>
    
    @Query("SELECT * FROM ai_tasks WHERE id = :id")
    suspend fun getAiTaskById(id: String): AiTask?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAiTask(aiTask: AiTask)
    
    @Update
    suspend fun updateAiTask(aiTask: AiTask)
    
    @Delete
    suspend fun deleteAiTask(aiTask: AiTask)
    
    @Query("SELECT * FROM ai_task_history WHERE taskId = :taskId ORDER BY createdAt DESC LIMIT :limit")
    fun getAiTaskHistory(taskId: String, limit: Int = 50): Flow<List<AiTaskHistory>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAiTaskHistory(history: AiTaskHistory)
    
    @Query("SELECT * FROM user_ai_settings WHERE userId = :userId")
    suspend fun getUserAiSettings(userId: String): UserAiSettings?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUserAiSettings(settings: UserAiSettings)
    
    @Update
    suspend fun updateUserAiSettings(settings: UserAiSettings)
}
