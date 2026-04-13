# 📱 日历应用 APK 构建指南

## 🚀 快速开始

### 方式一：使用 Docker 构建（推荐 ⭐）

**前置要求**: 安装 Docker

```bash
# 使用构建脚本
./build-apk.sh docker

# 或手动执行
docker build -f Dockerfile.build -t calendar-builder .
docker create --name extract calendar-builder
docker cp extract:/app/calendar-app-debug.apk ./calendar-app.apk
docker rm extract
```

构建完成后，`calendar-app.apk` 将出现在项目根目录。

---

### 方式二：本地构建

**前置要求**:
- Node.js 18+
- Java JDK 17
- Android SDK (API 33+)

**macOS 安装步骤**:

```bash
# 1. 安装 Java JDK 17
brew install openjdk@17

# 2. 安装 Android Studio
# 下载: https://developer.android.com/studio

# 3. 配置环境变量（添加到 ~/.zshrc）
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# 4. 使用构建脚本
./build-apk.sh local

# 或手动构建
npm ci
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

---

## 📦 构建输出

构建成功后，APK 文件位置：

| 构建方式 | 输出路径 |
|---------|---------|
| Docker | `./calendar-app.apk` |
| 本地 Debug | `android/app/build/outputs/apk/debug/app-debug.apk` |
| 本地 Release | `android/app/build/outputs/apk/release/app-release-unsigned.apk` |

---

## 🔐 发布版本签名

发布到应用商店需要签名 APK：

```bash
# 1. 生成密钥库
keytool -genkey -v -keystore my-release-key.keystore -alias calendar -keyalg RSA -keysize 2048 -validity 10000

# 2. 签名 APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk calendar

# 3. 优化 APK
zipalign -v 4 app-release-unsigned.apk calendar-app-release.apk
```

---

## 🛠 项目结构

```
├── android/                    # 原生安卓项目
│   ├── app/
│   │   ├── src/main/assets/public/  # Web 应用资源
│   │   └── build.gradle       # 应用构建配置
│   └── build.gradle           # 项目构建配置
├── src/                       # React 源码
├── dist/                      # Web 构建输出
├── capacitor.config.ts        # Capacitor 配置
├── Dockerfile.build           # Docker 构建文件
├── build-apk.sh              # 构建脚本
└── BUILD_APK.md              # 详细构建文档
```

---

## 📋 应用信息

| 属性 | 值 |
|-----|-----|
| 应用 ID | `com.calendar.app` |
| 应用名称 | 日历 |
| 最低 SDK | API 26 (Android 8.0) |
| 目标 SDK | API 33 (Android 13) |
| 版本 | 1.0.0 |

---

## ✨ 功能特性

- ✅ 多视图日历（月/周/日/年）
- ✅ 事件管理（创建/编辑/删除）
- ✅ 智能提醒设置
- ✅ 搜索与筛选
- ✅ 多日历分类
- ✅ 深色/浅色主题
- ✅ 数据导入/导出
- ✅ 本地存储持久化

---

## ❓ 常见问题

### Q: Docker 构建很慢？
A: 首次构建需要下载基础镜像和依赖，后续会更快。可以使用镜像加速器。

### Q: 如何更新应用？
A: 修改代码后重新运行构建命令，APK 版本号需要在 `android/app/build.gradle` 中更新。

### Q: 支持哪些 Android 版本？
A: 最低支持 Android 8.0 (API 26)，建议 Android 10+ 获得最佳体验。

### Q: 如何调试？
A: 使用 Chrome DevTools 或 Android Studio 连接设备调试。

---

## 📚 相关文档

- [Capacitor 文档](https://capacitorjs.com/docs)
- [Android 开发者指南](https://developer.android.com/guide)
- [详细构建文档](./BUILD_APK.md)

---

## 📝 更新日志

### v1.0.0 (2026-04-13)
- 🎉 初始版本发布
- 支持多视图日历
- 事件管理功能
- 主题切换
- 数据导入/导出
