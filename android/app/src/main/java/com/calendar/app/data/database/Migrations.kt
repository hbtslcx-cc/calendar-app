package com.calendar.app.data.database

import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

object Migrations {
    
    val MIGRATION_1_2 = object : Migration(1, 2) {
        override fun migrate(db: SupportSQLiteDatabase) {
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `ai_tasks` (
                    `id` TEXT NOT NULL,
                    `userId` TEXT,
                    `taskType` TEXT NOT NULL,
                    `taskParams` TEXT NOT NULL,
                    `aiResponse` TEXT,
                    `status` TEXT DEFAULT 'pending',
                    `createdAt` INTEGER NOT NULL,
                    `completedAt` INTEGER,
                    PRIMARY KEY(`id`)
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `ai_task_history` (
                    `id` TEXT NOT NULL,
                    `taskId` TEXT NOT NULL,
                    `eventId` TEXT,
                    `action` TEXT NOT NULL,
                    `actionData` TEXT,
                    `createdAt` INTEGER NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`taskId`) REFERENCES `ai_tasks`(`id`) ON DELETE CASCADE,
                    FOREIGN KEY(`eventId`) REFERENCES `events`(`id`) ON DELETE SET NULL
                )
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `user_ai_settings` (
                    `userId` TEXT NOT NULL,
                    `apiProvider` TEXT DEFAULT 'openai',
                    `apiKeyEncrypted` TEXT,
                    `modelName` TEXT DEFAULT 'gpt-4',
                    `enableWebSearch` INTEGER DEFAULT 1,
                    `enableHistory` INTEGER DEFAULT 1,
                    `maxTokens` INTEGER DEFAULT 2000,
                    `temperature` REAL DEFAULT 0.7,
                    `updatedAt` INTEGER NOT NULL,
                    PRIMARY KEY(`userId`),
                    FOREIGN KEY(`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
                )
                """.trimIndent()
            )
        }
    }
    
    val MIGRATION_2_3 = object : Migration(2, 3) {
        override fun migrate(db: SupportSQLiteDatabase) {
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `weather_cache` (
                    `id` TEXT NOT NULL,
                    `cityName` TEXT NOT NULL,
                    `latitude` REAL NOT NULL,
                    `longitude` REAL NOT NULL,
                    `currentWeather` TEXT,
                    `forecast7d` TEXT,
                    `forecast24h` TEXT,
                    `airQuality` TEXT,
                    `lifeIndex` TEXT,
                    `createdAt` INTEGER NOT NULL,
                    `updatedAt` INTEGER NOT NULL,
                    PRIMARY KEY(`id`)
                )
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `saved_cities` (
                    `id` TEXT NOT NULL,
                    `userId` TEXT NOT NULL,
                    `cityName` TEXT NOT NULL,
                    `countryName` TEXT,
                    `latitude` REAL NOT NULL,
                    `longitude` REAL NOT NULL,
                    `isDefault` INTEGER DEFAULT 0,
                    `sortOrder` INTEGER DEFAULT 0,
                    `createdAt` INTEGER NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
                )
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `user_weather_settings` (
                    `userId` TEXT NOT NULL,
                    `locationType` TEXT DEFAULT 'gps',
                    `temperatureUnit` TEXT DEFAULT 'celsius',
                    `autoUpdate` INTEGER DEFAULT 1,
                    `updateFrequency` INTEGER DEFAULT 180,
                    `showCityName` INTEGER DEFAULT 1,
                    `showAirQuality` INTEGER DEFAULT 1,
                    `showLifeIndex` INTEGER DEFAULT 1,
                    `weatherNotification` INTEGER DEFAULT 1,
                    `defaultCityId` TEXT,
                    `updatedAt` INTEGER NOT NULL,
                    PRIMARY KEY(`userId`),
                    FOREIGN KEY(`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
                    FOREIGN KEY(`defaultCityId`) REFERENCES `saved_cities`(`id`) ON DELETE SET NULL
                )
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `alarms` (
                    `id` TEXT NOT NULL,
                    `userId` TEXT NOT NULL,
                    `hour` INTEGER NOT NULL,
                    `minute` INTEGER NOT NULL,
                    `label` TEXT,
                    `isEnabled` INTEGER DEFAULT 1,
                    `repeatType` TEXT DEFAULT 'once',
                    `repeatDays` TEXT,
                    `ringtoneUri` TEXT,
                    `ringtoneName` TEXT,
                    `vibrationEnabled` INTEGER DEFAULT 1,
                    `snoozeEnabled` INTEGER DEFAULT 1,
                    `snoozeMinutes` INTEGER DEFAULT 10,
                    `snoozeCount` INTEGER DEFAULT 3,
                    `createdAt` INTEGER NOT NULL,
                    `updatedAt` INTEGER NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
                )
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `alarm_logs` (
                    `id` TEXT NOT NULL,
                    `alarmId` TEXT NOT NULL,
                    `triggerTime` INTEGER NOT NULL,
                    `stopTime` INTEGER,
                    `snoozeCount` INTEGER DEFAULT 0,
                    `action` TEXT NOT NULL,
                    `createdAt` INTEGER NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`alarmId`) REFERENCES `alarms`(`id`) ON DELETE CASCADE
                )
                """.trimIndent()
            )
            
            db.execSQL(
                """
                CREATE TABLE IF NOT EXISTS `user_alarm_settings` (
                    `userId` TEXT NOT NULL,
                    `defaultRingtoneUri` TEXT,
                    `defaultRingtoneName` TEXT,
                    `defaultVibration` INTEGER DEFAULT 1,
                    `defaultSnoozeMinutes` INTEGER DEFAULT 10,
                    `defaultSnoozeCount` INTEGER DEFAULT 3,
                    `gradualVolume` INTEGER DEFAULT 0,
                    `maxRingDuration` INTEGER DEFAULT 300,
                    `ringInSilent` INTEGER DEFAULT 0,
                    `showInNotification` INTEGER DEFAULT 1,
                    `updatedAt` INTEGER NOT NULL,
                    PRIMARY KEY(`userId`),
                    FOREIGN KEY(`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
                )
                """.trimIndent()
            )
            
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_saved_cities_userId` ON `saved_cities`(`userId`)")
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_saved_cities_isDefault` ON `saved_cities`(`isDefault`)")
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_alarms_userId` ON `alarms`(`userId`)")
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_alarms_isEnabled` ON `alarms`(`isEnabled`)")
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_alarm_logs_alarmId` ON `alarm_logs`(`alarmId`)")
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_weather_cache_cityName` ON `weather_cache`(`cityName`)")
            db.execSQL("CREATE INDEX IF NOT EXISTS `index_weather_cache_updatedAt` ON `weather_cache`(`updatedAt`)")
        }
    }
    
    val ALL_MIGRATIONS = arrayOf(MIGRATION_1_2, MIGRATION_2_3)
}
