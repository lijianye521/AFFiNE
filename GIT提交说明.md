# Git 提交说明

## 📋 当前修改内容

### 核心代码修改（UI隐藏）

1. **`.gitignore`**

   - 添加 Docker 数据目录忽略规则
   - 避免提交 postgres/storage/config 数据文件

2. **`packages/frontend/core/src/components/top-tip.tsx`**

   - 注释了第 76-94 行的 LocalDemoTips 组件
   - 隐藏顶部红色警告横幅

3. **`packages/frontend/core/src/components/root-app-sidebar/index.tsx`**
   - 注释了第 255-256 行的 Download App 按钮
   - 隐藏左下角下载按钮

### 新增部署文件

4. **`.docker/selfhost/deploy.bat`** (Windows部署脚本)
5. **`.docker/selfhost/deploy.sh`** (Linux/Mac部署脚本)
6. **`AFFiNE部署完整指南.md`** (完整部署文档)
7. **`affine-ui-hider.user.js`** (浏览器扩展脚本)

---

## 🚫 不应该提交的文件

以下文件夹包含运行时数据，**已在 .gitignore 中排除**：

- `.docker/selfhost/postgres/` - 数据库文件
- `.docker/selfhost/storage/` - 文档和附件
- `.docker/selfhost/config/` - 配置文件
- `.docker/selfhost/.env` - 环境变量
- `*.log` - 日志文件
- `build-*.log` - 构建日志

---

## ✅ 建议的提交命令

```bash
# 添加修改的文件
git add .gitignore
git add packages/frontend/core/src/components/top-tip.tsx
git add packages/frontend/core/src/components/root-app-sidebar/index.tsx

# 添加部署文件
git add .docker/selfhost/deploy.bat
git add .docker/selfhost/deploy.sh
git add AFFiNE部署完整指南.md
git add affine-ui-hider.user.js

# 提交
git commit -m "feat: 自定义UI并添加Docker部署脚本

- 隐藏顶部红色警告横幅
- 隐藏左下角Download App按钮
- 添加Windows/Linux部署脚本
- 添加完整部署文档
- 更新.gitignore排除Docker数据文件"

# 推送（如果需要）
# git push origin canary
```

---

## 📝 提交信息说明

### 提交类型

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `chore`: 构建/工具变更

### 本次提交

- **类型**: `feat` (新功能 - UI自定义)
- **范围**: 前端UI组件 + 部署脚本
- **描述**: 自定义UI并添加部署脚本

---

## 🔍 检查提交内容

提交前检查：

```bash
# 查看将要提交的文件
git status

# 查看具体修改
git diff packages/frontend/core/src/components/top-tip.tsx
git diff packages/frontend/core/src/components/root-app-sidebar/index.tsx

# 确认没有包含数据文件
git status | grep -i postgres
git status | grep -i storage
```

如果看到 postgres/storage/config 相关文件，说明 .gitignore 没生效，需要：

```bash
git rm -r --cached .docker/selfhost/postgres/
git rm -r --cached .docker/selfhost/storage/
git rm -r --cached .docker/selfhost/config/
```

---

## ⚠️ 注意事项

1. **不要提交敏感信息**

   - .env 文件（包含密码）
   - 数据库文件
   - 用户上传的文件

2. **不要提交临时文件**

   - \*.log
   - build-\*.log
   - node_modules/
   - dist/

3. **提交前检查**
   - 确保代码可以编译
   - 确保没有语法错误
   - 确保 .gitignore 正确配置

---

## 🎯 后续工作

如果需要从源码构建Docker镜像（应用UI修改）：

```bash
# 1. 构建前端
yarn affine build --package web

# 2. 构建后端
yarn affine build --package server

# 3. 构建Docker镜像（需要创建Dockerfile）
docker build -t affine-custom:latest .

# 4. 修改 docker-compose.yml 使用自定义镜像
# image: affine-custom:latest
```

**注意**: 当前使用的是官方镜像，UI修改不会生效，除非：

- 从源码构建自定义Docker镜像，或
- 使用浏览器扩展（Stylus/Tampermonkey）应用UI隐藏
