package com.calendar.app.data.dao

import androidx.room.*
import com.calendar.app.data.entity.User
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    
    @Query("SELECT * FROM users WHERE id = :id")
    fun getUserById(id: String): Flow<User?>
    
    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getUserByIdSync(id: String): User?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: User)
    
    @Update
    suspend fun updateUser(user: User)
    
    @Delete
    suspend fun deleteUser(user: User)
}
