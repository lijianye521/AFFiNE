# AFFiNE Docker 部署完整指南

> 本文档包含 AFFiNE 的 Docker 部署方法和 UI 自定义方案

---

## 📋 目录

1. [快速部署](#快速部署)
2. [Docker 常用命令](#docker-常用命令)
3. [隐藏 UI 元素](#隐藏-ui-元素)
4. [故障排查](#故障排查)
5. [数据备份](#数据备份)

---

## 🚀 快速部署

### 前置要求

- 已安装 Docker Desktop
- Docker 正在运行

### 部署步骤

#### 1. 进入部署目录

```bash
cd .docker/selfhost
```

#### 2. 启动服务

**Windows:**

```bash
deploy.bat
```

**Linux/Mac:**

```bash
./deploy.sh
```

或者手动启动：

```bash
docker compose up -d
```

#### 3. 访问 AFFiNE

打开浏览器访问：`http://localhost:3010`

---

## 🐳 Docker 常用命令

### 服务管理

```bash
# 进入部署目录
cd C:\Users\lijianye\Desktop\gitLab\affine-source\.docker\selfhost

# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f affine
```

### 更新升级

```bash
# 更新到最新版本
docker compose pull
docker compose up -d

# 强制重新创建容器
docker compose up -d --force-recreate
```

### 数据管理

```bash
# 完全清理（包括数据）
docker compose down -v

# 清理旧镜像
docker image prune -a
```

---

## 🎨 隐藏 UI 元素

### 需要隐藏的元素

- 顶部红色警告横幅
- 左下角 "Download App" 按钮
- 文档图标选择按钮
- 相关分隔线

### 方法1：浏览器扩展（推荐）

#### 使用 Stylus

1. **安装扩展**

   - Chrome/Edge: https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne
   - Firefox: https://addons.mozilla.org/firefox/addon/styl-us/

2. **添加样式**
   - 打开 `http://localhost:3010`
   - 点击 Stylus 图标 → "编写适用于 localhost 的样式"
   - 粘贴以下 CSS：

```css
/* 隐藏顶部红色警告横幅 */
[data-testid='local-demo-tips'] {
  display: none !important;
  visibility: hidden !important;
}

/* 隐藏底部 Download App 按钮 */
aside > div:last-of-type > div:last-of-type {
  display: none !important;
}

/* 隐藏文档图标按钮 */
.doc-icon-container,
button[aria-label='Select Icon'],
button[title='Select Icon'] {
  display: none !important;
  height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* 隐藏分隔线 */
span._1f82jwd,
span[class*='_1f82jwd'] {
  display: none !important;
}
```

3. **保存并刷新页面**（Ctrl+Shift+R）

#### 使用 Tampermonkey

1. **安装扩展**

   - Chrome/Edge: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   - Firefox: https://addons.mozilla.org/firefox/addon/tampermonkey/

2. **创建脚本**
   - 点击 Tampermonkey 图标 → "添加新脚本"
   - 粘贴以下代码：

```javascript
// ==UserScript==
// @name         AFFiNE UI Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        http://localhost:3010/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
        [data-testid="local-demo-tips"],
        .doc-icon-container,
        button[aria-label="Select Icon"],
        span._1f82jwd,
        aside > div:last-of-type > div:last-of-type {
            display: none !important;
            visibility: hidden !important;
        }
    `;
  document.head.appendChild(style);

  function hideElements() {
    document.querySelectorAll('[data-testid="local-demo-tips"], .doc-icon-container, button[aria-label="Select Icon"], span._1f82jwd').forEach(el => {
      el.style.display = 'none';
    });

    const downloadBtn = document.querySelector('aside > div:last-of-type > div:last-of-type');
    if (downloadBtn) downloadBtn.style.display = 'none';
  }

  hideElements();
  setInterval(hideElements, 1000);
})();
```

3. **保存并刷新页面**

### 方法2：临时隐藏（Console）

1. 打开 `http://localhost:3010`
2. 按 `F12` 打开开发者工具
3. 切换到 **Console** 标签
4. 粘贴以下代码并回车：

```javascript
(function () {
  const s = document.createElement('style');
  s.textContent = '[data-testid="local-demo-tips"],.doc-icon-container,button[aria-label="Select Icon"],span._1f82jwd,aside>div:last-of-type>div:last-of-type{display:none!important}';
  document.head.appendChild(s);
  document.querySelectorAll('[data-testid="local-demo-tips"],.doc-icon-container,button[aria-label="Select Icon"],span._1f82jwd').forEach(e => (e.style.display = 'none'));
  const d = document.querySelector('aside>div:last-of-type>div:last-of-type');
  if (d) d.style.display = 'none';
  console.log('✅ UI元素已隐藏！');
})();
```

**注意：** 刷新页面后需要重新运行此代码

---

## 🐛 故障排查

### 服务无法启动

```bash
# 查看错误日志
docker compose logs affine

# 检查端口占用
netstat -ano | findstr 3010

# 完全重置
docker compose down -v
docker compose up -d
```

### 数据库连接失败

```bash
# 检查 postgres 容器
docker compose logs postgres

# 重启数据库
docker compose restart postgres

# 检查健康状态
docker exec affine_postgres pg_isready
```

### 无法访问页面

**检查清单：**

- Docker Desktop 是否运行？
- 服务是否启动成功？`docker compose ps`
- 防火墙是否阻止？
- 端口 3010 是否被占用？

---

## 💾 数据备份

### 备份数据

```bash
# 进入部署目录
cd .docker/selfhost

# 停止服务（可选，确保数据一致性）
docker compose stop

# 备份数据
tar -czf affine-backup-$(date +%Y%m%d).tar.gz storage config postgres

# 重启服务
docker compose start
```

**Windows 用户：**

```powershell
Compress-Archive -Path storage,config,postgres -DestinationPath affine-backup.zip
```

### 恢复数据

```bash
# 停止服务
docker compose down

# 删除旧数据
rm -rf storage config postgres

# 解压备份
tar -xzf affine-backup-20251020.tar.gz

# 启动服务
docker compose up -d
```

### 数据存储位置

项目目录下的这些文件夹包含所有数据：

- `storage/` - 文档和附件
- `config/` - 配置文件
- `postgres/` - 数据库

**重要：** 定期备份这三个文件夹！

---

## ⚙️ 配置说明

### 环境变量（.env 文件）

```bash
# 数据库配置
DB_USERNAME=affine
DB_PASSWORD=affine_password_change_me  # 建议修改
DB_DATABASE=affine

# 数据存储路径
UPLOAD_LOCATION=./storage
CONFIG_LOCATION=./config
DB_DATA_LOCATION=./postgres

# 访问端口
PORT=3010

# AFFiNE 版本
AFFINE_REVISION=stable  # stable=稳定版，latest=最新版
```

### 修改配置

1. 编辑 `.docker/selfhost/.env` 文件
2. 重启服务：`docker compose restart`

---

## 🔐 安全建议

1. **修改默认密码**

   - 编辑 `.env` 中的 `DB_PASSWORD`
   - 使用强密码

2. **定期备份**

   - 每周备份 `storage/`、`config/`、`postgres/`
   - 保存到云存储或外部硬盘

3. **网络安全**
   - 默认只能从本机访问（localhost）
   - 远程访问需配置 HTTPS 和认证

---

## 📚 常见问题

### Q: 端口 3010 被占用？

**解决方法：**

1. 修改 `.env` 中的 `PORT=3010` 为其他端口
2. 重启服务

### Q: 数据会丢失吗？

**答：** 不会。数据保存在 `storage/`、`config/`、`postgres/` 目录，只要备份这些文件夹即可。

### Q: 如何更新版本？

```bash
docker compose pull
docker compose up -d
```

### Q: 如何完全卸载？

```bash
cd .docker/selfhost
docker compose down -v
rm -rf storage config postgres
```

---

## 📞 获取帮助

- GitHub Issues: https://github.com/toeverything/AFFiNE/issues
- Discord: https://affine.pro/redirect/discord
- 官方文档: https://docs.affine.pro/

---

## ✅ 部署检查清单

- [ ] Docker Desktop 已安装并运行
- [ ] 执行 `docker compose up -d`
- [ ] 可以访问 `http://localhost:3010`
- [ ] UI 元素已隐藏（如需要）
- [ ] 已修改默认数据库密码
- [ ] 已设置定期备份计划

---

**部署完成！享受使用 AFFiNE！** 🎉
