package com.calendar.app.data.dao

import androidx.room.*
import com.calendar.app.data.entity.Tag
import kotlinx.coroutines.flow.Flow

@Dao
interface TagDao {
    
    @Query("SELECT * FROM tags ORDER BY name ASC")
    fun getAllTags(): Flow<List<Tag>>
    
    @Query("SELECT * FROM tags WHERE id = :id")
    suspend fun getTagById(id: String): Tag?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTag(tag: Tag)
    
    @Update
    suspend fun updateTag(tag: Tag)
    
    @Delete
    suspend fun deleteTag(tag: Tag)
}
