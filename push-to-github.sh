#!/bin/bash

# GitHub 推送辅助脚本
# 用于将日历应用推送到 GitHub 并触发自动构建

set -e

echo "=================================="
echo "   日历应用 - GitHub 推送脚本"
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}$1${NC}"
}

success() {
    echo -e "${GREEN}$1${NC}"
}

warning() {
    echo -e "${YELLOW}$1${NC}"
}

error() {
    echo -e "${RED}$1${NC}"
}

# 检查Git
check_git() {
    if ! command -v git &> /dev/null; then
        error "Git 未安装"
        exit 1
    fi
    success "✓ Git 已安装"
}

# 获取GitHub用户名
get_github_username() {
    echo ""
    log "请输入你的 GitHub 用户名:"
    read -r GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        error "用户名不能为空"
        exit 1
    fi
    
    echo ""
    log "请输入仓库名称 (默认: calendar-app):"
    read -r REPO_NAME
    REPO_NAME=${REPO_NAME:-calendar-app}
    
    success "✓ 将推送到: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
}

# 显示推送步骤
show_push_steps() {
    echo ""
    echo "=================================="
    log "推送步骤:"
    echo "=================================="
    echo ""
    echo "1. 在浏览器中打开以下链接创建仓库:"
    echo "   ${BLUE}https://github.com/new${NC}"
    echo ""
    echo "   填写信息:"
    echo "   - Repository name: ${YELLOW}$REPO_NAME${NC}"
    echo "   - Description: 安卓日历应用"
    echo "   - Visibility: Public 或 Private"
    echo ""
    echo "2. 点击 ${GREEN}Create repository${NC}"
    echo ""
    echo "3. 然后运行以下命令:"
    echo ""
    echo "   ${YELLOW}git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git${NC}"
    echo "   ${YELLOW}git push -u origin main${NC}"
    echo ""
}

# 自动推送（如果仓库已存在）
auto_push() {
    echo ""
    log "尝试自动推送..."
    
    # 检查远程仓库是否已配置
    if git remote -v > /dev/null 2>&1; then
        success "✓ 远程仓库已配置"
        echo ""
        log "正在推送代码..."
        git push -u origin main
        success "✓ 推送成功！"
        show_next_steps
    else
        warning "远程仓库未配置"
        show_push_steps
    fi
}

# 显示后续步骤
show_next_steps() {
    echo ""
    echo "=================================="
    success "   推送成功！"
    echo "=================================="
    echo ""
    log "GitHub Actions 将自动构建 APK:"
    echo ""
    echo "1. 访问 Actions 页面:"
    echo "   ${BLUE}https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions${NC}"
    echo ""
    echo "2. 等待构建完成 (约 3-5 分钟)"
    echo ""
    echo "3. 下载 APK:"
    echo "   - 点击最新的工作流运行"
    echo "   - 在 Artifacts 部分下载"
    echo "   - ${GREEN}calendar-app-debug${NC} 或 ${GREEN}calendar-app-release${NC}"
    echo ""
    success "构建完成后即可安装到安卓设备！"
    echo ""
}

# 主菜单
main_menu() {
    echo ""
    echo "请选择操作:"
    echo ""
    echo "  1) 显示手动推送步骤"
    echo "  2) 尝试自动推送（仓库已存在）"
    echo "  3) 检查GitHub登录状态"
    echo "  4) 退出"
    echo ""
    log "请输入选项 (1-4):"
    read -r choice
    
    case $choice in
        1)
            get_github_username
            show_push_steps
            ;;
        2)
            auto_push
            ;;
        3)
            check_github_auth
            ;;
        4)
            exit 0
            ;;
        *)
            error "无效选项"
            main_menu
            ;;
    esac
}

# 检查GitHub认证
check_github_auth() {
    echo ""
    log "检查GitHub认证..."
    
    # 尝试访问GitHub API
    if curl -s https://api.github.com/user | grep -q "login"; then
        success "✓ 可以访问GitHub API"
    else
        warning "无法访问GitHub API，可能需要登录"
    fi
    
    main_menu
}

# 主程序
main() {
    check_git
    
    # 检查是否在Git仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "当前目录不是Git仓库"
        exit 1
    fi
    success "✓ Git仓库已初始化"
    
    # 显示当前状态
    echo ""
    log "当前Git状态:"
    git log --oneline -1
    echo ""
    
    main_menu
}

# 运行主程序
main
