import os
import shutil

def main():
    # 源目录和目标目录
    src_dir = "/Users/bytedance/test002/android/app/src/main/java/com/calendarapp"
    dst_dir = "/Users/bytedance/test002/android/app/src/main/java/com/calendar/app"
    
    # 创建目标目录
    os.makedirs(dst_dir, exist_ok=True)
    
    # 遍历所有 Kotlin 文件
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(".kt") or file.endswith(".md"):
                # 构建源文件路径
                src_file = os.path.join(root, file)
                
                # 计算相对路径
                rel_path = os.path.relpath(src_file, src_dir)
                dst_file = os.path.join(dst_dir, rel_path)
                
                # 创建目标目录
                os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                
                # 如果是 Kotlin 文件，更新包名
                if file.endswith(".kt"):
                    with open(src_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # 更新包名
                    content = content.replace("package com.calendarapp.", "package com.calendar.app.")
                    content = content.replace("import com.calendarapp.", "import com.calendar.app.")
                    content = content.replace("package com.calendarapp\n", "package com.calendar.app\n")
                    content = content.replace("import com.calendarapp\n", "import com.calendar.app\n")
                    
                    with open(dst_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                else:
                    # 直接复制其他文件
                    shutil.copy2(src_file, dst_file)
                
                print(f"Processed: {rel_path}")
    
    print("\n✅ Package names fixed successfully!")

if __name__ == "__main__":
    main()
