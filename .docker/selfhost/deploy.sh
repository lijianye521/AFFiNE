#!/bin/bash

echo "========================================"
echo "   AFFiNE Docker 一键部署脚本"
echo "========================================"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "[错误] 未检测到 Docker，请先安装 Docker"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "[1/4] 检查 Docker 环境... 成功"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "[错误] 未找到 .env 配置文件"
    echo "请确保 .env 文件存在于当前目录"
    exit 1
fi

echo "[2/4] 检查配置文件... 成功"
echo ""

# 创建必要的目录
mkdir -p storage config postgres

echo "[3/4] 创建数据目录... 成功"
echo ""

# 启动服务
echo "[4/4] 启动 AFFiNE 服务..."
echo "这可能需要几分钟时间，请耐心等待..."
echo ""

docker compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "   部署成功！"
    echo "========================================"
    echo ""
    echo "访问地址: http://localhost:3010"
    echo ""
    echo "常用命令:"
    echo "  查看日志: docker compose logs -f affine"
    echo "  停止服务: docker compose down"
    echo "  重启服务: docker compose restart"
    echo ""
else
    echo ""
    echo "[错误] 部署失败，请检查错误信息"
    exit 1
fi
