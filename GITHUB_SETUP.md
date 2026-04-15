# GitHub 仓库设置步骤

## 🔗 快速创建仓库

请点击以下链接创建仓库：

**👉 https://github.com/new**

### 填写信息：
- **Repository name**: `calendar-app`
- **Description**: 安卓日历应用
- **Visibility**: Public
- ✅ 勾选 "Add a README file"（可选）
- 点击 **Create repository**

---

## 📤 推送代码

创建仓库后，在终端执行：

```bash
# 推送代码到GitHub
git push -u origin main
```

如果提示输入用户名和密码：
- **用户名**: 你的GitHub用户名
- **密码**: 使用 Personal Access Token（不是登录密码）

### 创建 Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 填写 Note: "Calendar App"
4. 勾选 `repo` 权限
5. 点击 **Generate token**
6. 复制生成的 token（只显示一次）

---

## ✅ 验证推送

推送成功后，访问：
```
https://github.com/hbtslcx/calendar-app
```

应该能看到所有代码文件。

---

## 🚀 自动构建 APK

推送完成后，GitHub Actions 会自动开始构建：

1. 访问 Actions 页面：
   ```
   https://github.com/hbtslcx/calendar-app/actions
   ```

2. 等待构建完成（约 3-5 分钟）

3. 下载 APK：
   - 点击最新的工作流运行
   - 在 Artifacts 部分下载 `calendar-app-debug`

---

## 🆘 如果遇到问题

### 问题1: 没有权限
```bash
# 尝试使用SSH方式
git remote set-url origin git@github.com:hbtslcx/calendar-app.git
git push -u origin main
```

### 问题2: 仓库已存在
如果提示仓库已存在，请访问：
```
https://github.com/hbtslcx/calendar-app/settings
```
确认仓库存在且你有权限访问。

### 问题3: 需要登录
```bash
# 配置Git使用缓存（避免重复输入密码）
git config --global credential.helper cache
```

---

## 📋 下一步

1. ✅ 点击 https://github.com/new 创建仓库
2. ✅ 运行 `git push -u origin main`
3. ✅ 访问 Actions 页面查看构建状态
4. ✅ 下载 APK 文件

有任何问题请告诉我！
