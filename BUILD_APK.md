# 安卓APK构建指南

## 项目概述
这是一个基于Capacitor的安卓日历应用，使用React + TypeScript + Tailwind CSS开发。

## 构建方法

### 方法一：本地构建（推荐）

#### 前置要求
1. **Node.js** 18+ 
2. **Java JDK** 17
3. **Android Studio** 或 **Android SDK Command Line Tools**
4. **Android SDK** (API 33+)

#### 步骤

1. **安装Java JDK**
```bash
# macOS (使用Homebrew)
brew install openjdk@17

# 或从Oracle官网下载
# https://www.oracle.com/java/technologies/downloads/
```

2. **安装Android Studio**
- 下载地址：https://developer.android.com/studio
- 安装时选择 "Android SDK", "Android SDK Platform-Tools", "Android SDK Build-Tools"

3. **配置环境变量**
```bash
# 添加到 ~/.zshrc 或 ~/.bash_profile
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

4. **构建APK**
```bash
# 1. 安装依赖
npm install

# 2. 构建Web应用
npm run build

# 3. 同步到安卓项目
npx cap sync android

# 4. 打开Android Studio（可选，用于调试）
npx cap open android

# 5. 构建APK
npx cap build android --keystorepath ./my-key.keystore --keystorepass password --keystorealias key0 --keystorealiaspass password
```

### 方法二：使用Gradle直接构建

```bash
# 进入安卓项目目录
cd android

# 构建Debug APK
./gradlew assembleDebug

# 构建Release APK（需要签名密钥）
./gradlew assembleRelease

# APK输出位置
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 方法三：使用Docker构建

创建 `Dockerfile.build`:

```dockerfile
FROM openjdk:17-jdk-slim

# 安装Node.js
RUN apt-get update && apt-get install -y curl unzip \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# 安装Android SDK
ENV ANDROID_SDK_ROOT=/opt/android-sdk
RUN mkdir -p ${ANDROID_SDK_ROOT} \
    && cd ${ANDROID_SDK_ROOT} \
    && curl -o sdk-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip \
    && unzip sdk-tools.zip \
    && rm sdk-tools.zip

ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/bin

# 接受许可证并安装SDK
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

WORKDIR /app
COPY . .

RUN npm install \
    && npm run build \
    && npx cap sync android

# 构建APK
RUN cd android && ./gradlew assembleDebug
```

构建命令:
```bash
docker build -f Dockerfile.build -t calendar-builder .
docker create --name extract calendar-builder
docker cp extract:/app/android/app/build/outputs/apk/debug/app-debug.apk ./calendar-app.apk
docker rm extract
```

## 签名Release APK

### 生成密钥库
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 签名APK
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk my-alias

# 优化APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## 项目结构

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/public/    # Web应用资源
│   │   │   ├── java/             # Java/Kotlin代码
│   │   │   └── res/              # 资源文件（图标、布局等）
│   │   └── AndroidManifest.xml   # 应用配置
│   └── build.gradle              # 应用构建配置
├── build.gradle                  # 项目构建配置
└── gradle.properties             # Gradle属性
```

## 常见问题

### 1. Java版本不匹配
确保使用Java 17，可以在`gradle.properties`中配置：
```properties
org.gradle.java.home=/path/to/jdk-17
```

### 2. SDK许可证未接受
```bash
yes | sdkmanager --licenses
```

### 3. 构建失败
尝试清理后重新构建：
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 应用信息

- **应用ID**: com.calendar.app
- **应用名称**: 日历
- **最低SDK**: API 26 (Android 8.0)
- **目标SDK**: API 33 (Android 13)

## 功能特性

✅ 多视图日历（月/周/日/年）
✅ 事件管理（创建/编辑/删除）
✅ 智能提醒
✅ 搜索与筛选
✅ 多日历分类
✅ 主题切换（浅色/深色）
✅ 数据导入/导出
✅ 本地存储持久化
