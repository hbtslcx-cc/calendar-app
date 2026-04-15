# Android v3.0 集成指南

## 概述

本指南说明了如何将 v3.0 的天气模块和闹钟模块代码整合到 Android 项目中。

## 已完成的工作

### 1. 数据库层代码已创建

所有数据层代码已放置在正确位置：

```
android/app/src/main/java/com/calendarapp/data/
├── entity/
│   ├── User.kt
│   ├── Calendar.kt
│   ├── Event.kt
│   ├── Reminder.kt
│   ├── Tag.kt
│   ├── EventTag.kt
│   ├── AiTask.kt
│   ├── AiTaskHistory.kt
│   ├── UserAiSettings.kt
│   ├── WeatherCache.kt
│   ├── SavedCity.kt
│   ├── UserWeatherSettings.kt
│   ├── Alarm.kt
│   ├── AlarmLog.kt
│   └── UserAlarmSettings.kt
├── dao/
│   ├── UserDao.kt
│   ├── CalendarDao.kt
│   ├── EventDao.kt
│   ├── ReminderDao.kt
│   ├── TagDao.kt
│   ├── AiTaskDao.kt
│   ├── WeatherDao.kt
│   └── AlarmDao.kt
├── converter/
│   └── Converters.kt
└── database/
    ├── AppDatabase.kt
    ├── DatabaseProvider.kt
    ├── Migrations.kt
    └── MIGRATION_GUIDE.md
```

### 2. 项目配置已更新

- **variables.gradle** - 添加了 Kotlin、Room、Coroutines 等版本号
- **build.gradle (根目录)** - 添加了 Kotlin Gradle 插件
- **app/build.gradle** - 添加了 Kotlin 插件和所有必要的依赖

## 依赖库说明

### Kotlin 相关
- `kotlin-stdlib` - Kotlin 标准库
- `kotlinx-coroutines-core` - 协程核心库
- `kotlinx-coroutines-android` - Android 协程支持

### Android Architecture Components
- `lifecycle-viewmodel-ktx` - ViewModel 扩展
- `lifecycle-livedata-ktx` - LiveData 扩展
- `lifecycle-runtime-ktx` - 运行时扩展

### Room 数据库
- `room-runtime` - Room 运行时
- `room-ktx` - Room Kotlin 扩展
- `room-compiler` - Room 注解处理器 (kapt)

### 数据解析
- `gson` - JSON 解析库

## 下一步操作

### 1. 同步 Gradle 项目

在 Android Studio 中：
```
File → Sync Project with Gradle Files
```

或在命令行：
```bash
cd android
./gradlew build --dry-run
```

### 2. 解决可能的问题

**问题 1：Kotlin 版本冲突**
- 检查 variables.gradle 中的 kotlinVersion
- 确保与 Android Studio 的 Kotlin 插件版本兼容

**问题 2：Room 版本问题**
- 确保 roomVersion 与 compileSdkVersion 兼容

**问题 3：kapt 插件问题**
- 确保 `apply plugin: 'kotlin-kapt'` 在 app/build.gradle 顶部

### 3. 构建项目

```bash
cd android
./gradlew assembleDebug
```

### 4. 与 Capacitor 集成

由于这是一个 Capacitor 项目，需要确保：

1. Web 应用已构建：
```bash
npm run build
```

2. 同步到 Android：
```bash
npx cap sync android
```

## 数据库使用示例

### 初始化数据库

```kotlin
val db = DatabaseProvider.getDatabase(context)
```

### 天气数据操作

```kotlin
// 保存天气缓存
val weatherCache = WeatherCache(
    id = UUID.randomUUID().toString(),
    cityName = "北京",
    latitude = 39.9042,
    longitude = 116.4074,
    currentWeather = jsonString,
    createdAt = System.currentTimeMillis(),
    updatedAt = System.currentTimeMillis()
)
db.weatherDao().insertWeatherCache(weatherCache)

// 保存城市
val city = SavedCity(
    id = UUID.randomUUID().toString(),
    userId = "user1",
    cityName = "北京",
    latitude = 39.9042,
    longitude = 116.4074,
    isDefault = true,
    createdAt = System.currentTimeMillis()
)
db.weatherDao().insertSavedCity(city)
```

### 闹钟数据操作

```kotlin
// 创建闹钟
val alarm = Alarm(
    id = UUID.randomUUID().toString(),
    userId = "user1",
    hour = 7,
    minute = 30,
    label = "起床",
    isEnabled = true,
    repeatType = "daily",
    vibrationEnabled = true,
    snoozeEnabled = true,
    snoozeMinutes = 10,
    snoozeCount = 3,
    createdAt = System.currentTimeMillis(),
    updatedAt = System.currentTimeMillis()
)
db.alarmDao().insertAlarm(alarm)
```

## 注意事项

1. **包名一致性**：确保所有 Kotlin 文件的包名与项目配置一致
2. **数据库版本**：AppDatabase 中的 version 已设置为 3
3. **迁移脚本**：Migrations.kt 包含从 v1 → v2 → v3 的完整迁移
4. **Capacitor 优先**：这是 Capacitor 项目，Web 部分仍然是主要功能

## 文件清单

### 已修改/创建的文件

| 文件 | 状态 |
|------|------|
| `android/variables.gradle` | ✅ 已更新 |
| `android/build.gradle` | ✅ 已更新 |
| `android/app/build.gradle` | ✅ 已更新 |
| `android/app/src/main/java/com/calendarapp/data/entity/*.kt` | ✅ 已创建 |
| `android/app/src/main/java/com/calendarapp/data/dao/*.kt` | ✅ 已创建 |
| `android/app/src/main/java/com/calendarapp/data/converter/Converters.kt` | ✅ 已创建 |
| `android/app/src/main/java/com/calendarapp/data/database/*.kt` | ✅ 已创建 |
| `android/INTEGRATION_GUIDE.md` | ✅ 已创建 |

## 后续步骤建议

1. 同步 Gradle 项目
2. 解决任何编译错误
3. 测试数据库迁移
4. 创建 Repository 层
5. 创建 ViewModel 层
6. 实现 UI 层 (如果需要原生 UI)

## 联系方式

如有问题，请检查：
1. Gradle 控制台输出
2. Android Studio 的 Build 窗口
3. MIGRATION_GUIDE.md 文档
