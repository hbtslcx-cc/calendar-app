# 📤 推送到 GitHub 指南

## 快速推送步骤

### 1️⃣ 创建 GitHub 仓库

访问 https://github.com/new 创建新仓库：
- **Repository name**: `calendar-app`
- **Description**: 安卓日历应用
- **Visibility**: Public（推荐）
- 点击 **Create repository**

### 2️⃣ 推送代码

在终端执行以下命令（替换 `YOUR_USERNAME` 为你的GitHub用户名）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/calendar-app.git

# 推送代码
git push -u origin main
```

### 3️⃣ 验证推送

推送成功后，访问：
```
https://github.com/YOUR_USERNAME/calendar-app
```

应该能看到所有代码文件。

---

## 🚀 自动构建 APK

推送完成后，GitHub Actions 会自动开始构建：

### 查看构建状态

1. 访问 Actions 页面：
   ```
   https://github.com/YOUR_USERNAME/calendar-app/actions
   ```

2. 等待构建完成（约 3-5 分钟）

3. 点击最新的工作流运行记录

### 下载 APK

构建完成后，在页面底部找到 **Artifacts** 部分：

- **calendar-app-debug** - Debug 版本（推荐测试使用）
- **calendar-app-release** - Release 版本（未签名）

点击下载 ZIP 文件，解压后即可获得 APK。

---

## 📱 安装 APK

### 方法一：直接安装
```bash
adb install calendar-app-debug.apk
```

### 方法二：传输到手机安装
1. 将 APK 文件传输到安卓设备
2. 在文件管理器中点击安装
3. 允许安装未知来源应用

---

## 🔧 常见问题

### Q: 推送时提示权限错误？
A: 确保已登录GitHub账号，或使用SSH方式：
```bash
git remote add origin git@github.com:YOUR_USERNAME/calendar-app.git
```

### Q: 构建失败怎么办？
A: 检查以下几点：
1. 确保 `.github/workflows/build-apk.yml` 文件存在
2. 检查 Actions 页面的错误日志
3. 确保代码已正确推送

### Q: 如何更新应用？
A: 
1. 修改代码
2. 提交更改：`git add . && git commit -m "更新说明"`
3. 推送：`git push`
4. GitHub Actions 会自动重新构建

---

## 📋 文件说明

已为你准备的文件：
- ✅ `.github/workflows/build-apk.yml` - GitHub Actions 工作流
- ✅ `capacitor.config.ts` - Capacitor 配置
- ✅ `android/` - 安卓原生项目
- ✅ 完整日历应用源码

---

## 🎯 下一步

1. 执行上述推送命令
2. 告诉我你的GitHub仓库地址
3. 我帮你验证构建状态

或者直接访问你的仓库 Actions 页面查看构建进度！
