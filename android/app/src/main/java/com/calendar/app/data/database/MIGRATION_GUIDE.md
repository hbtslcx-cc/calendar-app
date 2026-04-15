# Room 数据库迁移指南

## 概述

本文档详细说明了从旧版本数据库结构迁移到 v3.0 的完整方案。

## 版本历史

| 数据库版本 | 说明 |
|-----------|------|
| 1 | 基础日历功能（用户、日历、事件、提醒、标签） |
| 2 | 新增 AI 智能任务模块 |
| 3 | 新增天气和闹钟模块 |

## 迁移脚本

### MIGRATION_1_2 (v1 → v2)

**新增数据表：**

| 表名 | 说明 |
|------|------|
| `ai_tasks` | AI 任务表 |
| `ai_task_history` | AI 任务历史表 |
| `user_ai_settings` | 用户 AI 设置表 |

**外键关系：**
- `ai_task_history.taskId` → `ai_tasks.id` (CASCADE)
- `ai_task_history.eventId` → `events.id` (SET NULL)
- `user_ai_settings.userId` → `users.id` (CASCADE)

---

### MIGRATION_2_3 (v2 → v3)

**新增数据表（天气模块）：**

| 表名 | 说明 |
|------|------|
| `weather_cache` | 天气缓存表 |
| `saved_cities` | 保存城市表 |
| `user_weather_settings` | 用户天气设置表 |

**新增数据表（闹钟模块）：**

| 表名 | 说明 |
|------|------|
| `alarms` | 闹钟表 |
| `alarm_logs` | 闹钟响铃记录表 |
| `user_alarm_settings` | 用户闹钟设置表 |

**新增索引：**
```sql
CREATE INDEX `index_saved_cities_userId` ON `saved_cities`(`userId`);
CREATE INDEX `index_saved_cities_isDefault` ON `saved_cities`(`isDefault`);
CREATE INDEX `index_alarms_userId` ON `alarms`(`userId`);
CREATE INDEX `index_alarms_isEnabled` ON `alarms`(`isEnabled`);
CREATE INDEX `index_alarm_logs_alarmId` ON `alarm_logs`(`alarmId`);
CREATE INDEX `index_weather_cache_cityName` ON `weather_cache`(`cityName`);
CREATE INDEX `index_weather_cache_updatedAt` ON `weather_cache`(`updatedAt`);
```

**外键关系：**
- `saved_cities.userId` → `users.id` (CASCADE)
- `user_weather_settings.userId` → `users.id` (CASCADE)
- `user_weather_settings.defaultCityId` → `saved_cities.id` (SET NULL)
- `alarms.userId` → `users.id` (CASCADE)
- `alarm_logs.alarmId` → `alarms.id` (CASCADE)
- `user_alarm_settings.userId` → `users.id` (CASCADE)

---

## 使用方法

### 1. 数据库初始化

```kotlin
val db = DatabaseProvider.getDatabase(context)
```

### 2. 直接使用 Room Database Builder

```kotlin
Room.databaseBuilder(
    context,
    AppDatabase::class.java,
    "calendar_app_db"
)
    .addMigrations(Migrations.MIGRATION_1_2)
    .addMigrations(Migrations.MIGRATION_2_3)
    .fallbackToDestructiveMigration() // 兜底方案
    .build()
```

### 3. 使用全部迁移

```kotlin
Room.databaseBuilder(
    context,
    AppDatabase::class.java,
    "calendar_app_db"
)
    .addMigrations(*Migrations.ALL_MIGRATIONS)
    .fallbackToDestructiveMigration()
    .build()
```

---

## 数据迁移安全建议

### 1. 测试迁移

在发布新版本前，请在测试环境中充分测试：
- 从 v1 直接升级到 v3
- 从 v2 升级到 v3
- 从 v1 升级到 v2 再升级到 v3

### 2. 备份数据

建议在升级前：
- 导出现有数据
- 提示用户备份
- 显示升级进度

### 3. 降级处理

如果需要降级，可以使用：
```kotlin
.fallbackToDestructiveMigrationOnDowngrade()
```

### 4. 监控错误

在生产环境中监控迁移错误：
```kotlin
.addCallback(object : RoomDatabase.Callback() {
    override fun onCreate(db: SupportSQLiteDatabase) {
        // 数据库创建时
    }
    
    override fun onOpen(db: SupportSQLiteDatabase) {
        // 数据库打开时
    }
})
```

---

## 表结构详情

### weather_cache 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| cityName | TEXT | 城市名称 |
| latitude | REAL | 纬度 |
| longitude | REAL | 经度 |
| currentWeather | TEXT | 当前天气 (JSON) |
| forecast7d | TEXT | 7天预报 (JSON) |
| forecast24h | TEXT | 24小时预报 (JSON) |
| airQuality | TEXT | 空气质量 (JSON) |
| lifeIndex | TEXT | 生活指数 (JSON) |
| createdAt | INTEGER | 创建时间 |
| updatedAt | INTEGER | 更新时间 |

### saved_cities 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键 |
| userId | TEXT | 用户ID (外键) |
| cityName | TEXT | 城市名称 |
| countryName | TEXT | 国家名称 |
| latitude | REAL | 纬度 |
| longitude | REAL | 经度 |
| isDefault | INTEGER | 是否默认城市 |
| sortOrder | INTEGER | 排序 |
| createdAt | INTEGER | 创建时间 |

### user_weather_settings 表

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| userId | TEXT | - | 主键，用户ID (外键) |
| locationType | TEXT | 'gps' | 定位类型 (gps/manual/ip) |
| temperatureUnit | TEXT | 'celsius' | 温度单位 (celsius/fahrenheit) |
| autoUpdate | INTEGER | 1 | 自动更新 |
| updateFrequency | INTEGER | 180 | 更新频率(分钟) |
| showCityName | INTEGER | 1 | 显示城市名 |
| showAirQuality | INTEGER | 1 | 显示空气质量 |
| showLifeIndex | INTEGER | 1 | 显示生活指数 |
| weatherNotification | INTEGER | 1 | 天气通知 |
| defaultCityId | TEXT | null | 默认城市ID (外键) |
| updatedAt | INTEGER | - | 更新时间 |

### alarms 表

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | TEXT | - | 主键 |
| userId | TEXT | - | 用户ID (外键) |
| hour | INTEGER | - | 小时 |
| minute | INTEGER | - | 分钟 |
| label | TEXT | null | 标签 |
| isEnabled | INTEGER | 1 | 是否启用 |
| repeatType | TEXT | 'once' | 重复类型 |
| repeatDays | TEXT | null | 重复星期 (JSON) |
| ringtoneUri | TEXT | null | 铃声URI |
| ringtoneName | TEXT | null | 铃声名称 |
| vibrationEnabled | INTEGER | 1 | 震动启用 |
| snoozeEnabled | INTEGER | 1 | 贪睡启用 |
| snoozeMinutes | INTEGER | 10 | 贪睡间隔(分钟) |
| snoozeCount | INTEGER | 3 | 贪睡次数 |
| createdAt | INTEGER | - | 创建时间 |
| updatedAt | INTEGER | - | 更新时间 |

### alarm_logs 表

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | TEXT | - | 主键 |
| alarmId | TEXT | - | 闹钟ID (外键) |
| triggerTime | INTEGER | - | 触发时间 |
| stopTime | INTEGER | null | 停止时间 |
| snoozeCount | INTEGER | 0 | 贪睡次数 |
| action | TEXT | - | 操作 (snooze/stop) |
| createdAt | INTEGER | - | 创建时间 |

### user_alarm_settings 表

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| userId | TEXT | - | 主键，用户ID (外键) |
| defaultRingtoneUri | TEXT | null | 默认铃声URI |
| defaultRingtoneName | TEXT | null | 默认铃声名称 |
| defaultVibration | INTEGER | 1 | 默认震动 |
| defaultSnoozeMinutes | INTEGER | 10 | 默认贪睡间隔 |
| defaultSnoozeCount | INTEGER | 3 | 默认贪睡次数 |
| gradualVolume | INTEGER | 0 | 渐强音量 |
| maxRingDuration | INTEGER | 300 | 最大响铃时长(秒) |
| ringInSilent | INTEGER | 0 | 静音模式下响铃 |
| showInNotification | INTEGER | 1 | 通知栏显示 |
| updatedAt | INTEGER | - | 更新时间 |

---

## 注意事项

1. **Boolean 类型**：Room 使用 INTEGER 存储 Boolean (0 = false, 1 = true)
2. **JSON 字段**：使用 Gson TypeConverter 转换为 TEXT
3. **外键约束**：确保数据一致性，使用 CASCADE/SET_NULL
4. **索引优化**：为常用查询字段创建索引
5. **兜底方案**：`fallbackToDestructiveMigration()` 作为最后的安全网
