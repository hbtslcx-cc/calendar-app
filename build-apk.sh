#!/bin/bash

# 安卓APK构建脚本
# 支持本地构建和Docker构建

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}   日历应用 APK 构建脚本${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# 检查构建方式
if [ "$1" == "docker" ]; then
    echo -e "${YELLOW}使用 Docker 构建...${NC}"
    
    # 检查Docker是否安装
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}错误: Docker 未安装${NC}"
        echo "请先安装Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # 构建Docker镜像
    echo -e "${BLUE}构建Docker镜像...${NC}"
    docker build -f Dockerfile.build -t calendar-builder .
    
    # 创建临时容器并提取APK
    echo -e "${BLUE}提取APK文件...${NC}"
    docker create --name extract calendar-builder
    docker cp extract:/app/calendar-app-debug.apk ./calendar-app.apk
    docker rm extract
    
    echo -e "${GREEN}✓ APK构建成功！${NC}"
    echo -e "${GREEN}文件位置: ./calendar-app.apk${NC}"
    
elif [ "$1" == "local" ]; then
    echo -e "${YELLOW}使用本地环境构建...${NC}"
    
    # 检查Java
    if ! command -v java &> /dev/null; then
        echo -e "${RED}错误: Java 未安装${NC}"
        echo "请先安装Java JDK 17:"
        echo "  macOS: brew install openjdk@17"
        echo "  或其他方式: https://www.oracle.com/java/technologies/downloads/"
        exit 1
    fi
    
    # 检查Android SDK
    if [ -z "$ANDROID_HOME" ]; then
        echo -e "${RED}错误: ANDROID_HOME 环境变量未设置${NC}"
        echo "请设置Android SDK路径:"
        echo "  export ANDROID_HOME=\$HOME/Library/Android/sdk"
        echo "  export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
        exit 1
    fi
    
    # 安装依赖
    echo -e "${BLUE}安装依赖...${NC}"
    npm ci
    
    # 构建Web应用
    echo -e "${BLUE}构建Web应用...${NC}"
    npm run build
    
    # 同步到安卓项目
    echo -e "${BLUE}同步到安卓项目...${NC}"
    npx cap sync android
    
    # 构建Debug APK
    echo -e "${BLUE}构建Debug APK...${NC}"
    cd android
    ./gradlew assembleDebug
    cd ..
    
    # 复制APK到根目录
    cp android/app/build/outputs/apk/debug/app-debug.apk ./calendar-app.apk
    
    echo -e "${GREEN}✓ APK构建成功！${NC}"
    echo -e "${GREEN}文件位置: ./calendar-app.apk${NC}"
    
else
    echo "使用方法:"
    echo ""
    echo "  ./build-apk.sh docker    # 使用Docker构建（推荐）"
    echo "  ./build-apk.sh local     # 使用本地环境构建"
    echo ""
    echo "说明:"
    echo "  - Docker构建: 无需配置Java和Android SDK环境"
    echo "  - 本地构建: 需要安装Java JDK 17和Android SDK"
    echo ""
    echo "前置要求:"
    echo "  Docker构建: 安装Docker"
    echo "  本地构建: Java JDK 17, Android SDK, Node.js 18+"
    exit 0
fi

echo ""
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}   构建完成！${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""
echo "APK信息:"
ls -lh ./calendar-app.apk
