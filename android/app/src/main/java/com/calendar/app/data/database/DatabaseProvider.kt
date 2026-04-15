package com.calendar.app.data.database

import android.content.Context
import androidx.room.Room

object DatabaseProvider {
    
    private const val DATABASE_NAME = "calendar_app_db"
    
    @Volatile
    private var INSTANCE: AppDatabase? = null
    
    fun getDatabase(context: Context): AppDatabase {
        return INSTANCE ?: synchronized(this) {
            val instance = Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                DATABASE_NAME
            )
                .addMigrations(*Migrations.ALL_MIGRATIONS)
                .fallbackToDestructiveMigration()
                .build()
            
            INSTANCE = instance
            instance
        }
    }
}
