#!/usr/bin/env node

/**
 * 手动构建APK脚本
 * 尝试使用系统中可能存在的工具构建APK
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runCommand(command, options = {}) {
  try {
    log(`执行: ${command}`, 'cyan');
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    log(`命令失败: ${command}`, 'red');
    return false;
  }
}

async function main() {
  log('=================================', 'blue');
  log('   日历应用 APK 手动构建脚本', 'blue');
  log('=================================', 'blue');
  console.log();

  // 检查 Node.js
  log('检查 Node.js 环境...', 'yellow');
  const nodeVersion = process.version;
  log(`✓ Node.js 版本: ${nodeVersion}`, 'green');

  // 检查 npm
  if (!checkCommand('npm')) {
    log('✗ npm 未找到', 'red');
    process.exit(1);
  }
  log('✓ npm 已安装', 'green');

  // 安装依赖
  log('\n安装依赖...', 'yellow');
  if (!runCommand('npm install')) {
    log('依赖安装失败', 'red');
    process.exit(1);
  }

  // 构建 Web 应用
  log('\n构建 Web 应用...', 'yellow');
  if (!runCommand('npm run build')) {
    log('Web 应用构建失败', 'red');
    process.exit(1);
  }

  // 检查 Capacitor
  log('\n检查 Capacitor...', 'yellow');
  if (!fs.existsSync('node_modules/@capacitor/core')) {
    log('安装 Capacitor...', 'yellow');
    if (!runCommand('npm install @capacitor/core @capacitor/cli @capacitor/android')) {
      log('Capacitor 安装失败', 'red');
      process.exit(1);
    }
  }

  // 同步安卓项目
  log('\n同步安卓项目...', 'yellow');
  if (!runCommand('npx cap sync android')) {
    log('同步失败', 'red');
    process.exit(1);
  }

  // 检查 Java
  log('\n检查 Java 环境...', 'yellow');
  if (!checkCommand('java')) {
    log('✗ Java 未安装', 'red');
    log('\n请安装 Java JDK 17:', 'yellow');
    log('  macOS: brew install openjdk@17', 'cyan');
    log('  下载: https://www.oracle.com/java/technologies/downloads/', 'cyan');
    
    // 尝试使用 Android Studio 自带的 JDK
    const androidStudioJdk = [
      '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
      '/Applications/Android Studio.app/Contents/jre/Contents/Home',
      `${process.env.HOME}/Applications/Android Studio.app/Contents/jbr/Contents/Home`,
      `${process.env.HOME}/Applications/Android Studio.app/Contents/jre/Contents/Home`
    ];
    
    let foundJdk = null;
    for (const jdkPath of androidStudioJdk) {
      if (fs.existsSync(jdkPath)) {
        foundJdk = jdkPath;
        break;
      }
    }
    
    if (foundJdk) {
      log(`\n发现 Android Studio JDK: ${foundJdk}`, 'green');
      log('设置 JAVA_HOME 环境变量...', 'yellow');
      process.env.JAVA_HOME = foundJdk;
      process.env.PATH = `${foundJdk}/bin:${process.env.PATH}`;
    } else {
      log('\n未找到 Java 环境，无法继续构建', 'red');
      log('请安装 Java 后重试', 'yellow');
      process.exit(1);
    }
  } else {
    const javaVersion = execSync('java -version 2>&1', { encoding: 'utf8' });
    log(`✓ Java 已安装:\n${javaVersion}`, 'green');
  }

  // 检查 Android SDK
  log('\n检查 Android SDK...', 'yellow');
  let androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  
  if (!androidHome) {
    // 尝试常见路径
    const possiblePaths = [
      `${process.env.HOME}/Library/Android/sdk`,
      '/usr/local/android-sdk',
      '/opt/android-sdk',
      `${process.env.HOME}/android-sdk`
    ];
    
    for (const sdkPath of possiblePaths) {
      if (fs.existsSync(sdkPath)) {
        androidHome = sdkPath;
        process.env.ANDROID_HOME = sdkPath;
        process.env.ANDROID_SDK_ROOT = sdkPath;
        break;
      }
    }
  }
  
  if (!androidHome || !fs.existsSync(androidHome)) {
    log('✗ Android SDK 未找到', 'red');
    log('\n请安装 Android Studio:', 'yellow');
    log('  下载: https://developer.android.com/studio', 'cyan');
    process.exit(1);
  }
  
  log(`✓ Android SDK: ${androidHome}`, 'green');
  process.env.PATH = `${androidHome}/tools:${androidHome}/platform-tools:${androidHome}/cmdline-tools/latest/bin:${process.env.PATH}`;

  // 构建 APK
  log('\n构建 Debug APK...', 'yellow');
  const androidDir = path.join(__dirname, 'android');
  
  if (!fs.existsSync(androidDir)) {
    log('✗ android 目录不存在', 'red');
    process.exit(1);
  }

  // 检查 gradlew
  const gradlewPath = path.join(androidDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
  if (!fs.existsSync(gradlewPath)) {
    log('✗ gradlew 不存在', 'red');
    process.exit(1);
  }

  // 执行构建
  const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  if (!runCommand(`${gradleCmd} assembleDebug`, { cwd: androidDir })) {
    log('APK 构建失败', 'red');
    process.exit(1);
  }

  // 复制 APK
  const apkSource = path.join(androidDir, 'app/build/outputs/apk/debug/app-debug.apk');
  const apkDest = path.join(__dirname, 'calendar-app.apk');
  
  if (fs.existsSync(apkSource)) {
    fs.copyFileSync(apkSource, apkDest);
    log('\n=================================', 'blue');
    log('   ✓ APK 构建成功！', 'green');
    log('=================================', 'blue');
    log(`\n文件位置: ${apkDest}`, 'cyan');
    
    const stats = fs.statSync(apkDest);
    log(`文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`, 'cyan');
    
    log('\n安装到设备:', 'yellow');
    log('  adb install calendar-app.apk', 'cyan');
  } else {
    log('✗ APK 文件未找到', 'red');
    process.exit(1);
  }
}

main().catch(error => {
  log(`错误: ${error.message}`, 'red');
  process.exit(1);
});
