# EdgeProxy

一个基于 Tencent Cloud EdgeOne Pages 的反向代理服务，支持动态域名注册和请求代理。

## 功能特性

- 🔄 **动态代理**: 支持运行时注册和删除域名代理规则
- ⚡ **边缘计算**: 基于 EdgeOne Pages 提供全球低延迟访问
- 🗄️ **持久化存储**: 使用 KV 存储保存代理映射关系
- 📝 **API 管理**: RESTful API 接口管理代理目标
- 🔍 **域名列表**: 查看所有已注册的代理域名
- ⚙️ **配置灵活**: 支持自定义代理目标和过期时间

## 项目结构

```
edgeproxy/
├── functions/              # Edge Functions 处理函数
│   ├── index.js            # 主页面和 API 文档
│   ├── config.js           # 配置文件
│   ├── utils.js            # 工具函数
│   ├── proxy/              # 代理处理
│   │   └── index.js
│   ├── target/             # 域名管理
│   │   └── [domain].js
│   └── list/               # 域名列表
│       └── index.js
├── .edgeone/               # EdgeOne 配置
├── package.json
└── README.md
```

## API 接口

### 根路径 - API 文档
```
GET /
```
返回 API 文档和可用端点信息。

### 注册/删除代理域名
```
GET /target/{domain}     # 注册域名 (默认代理到 https://{domain})
DELETE /target/{domain}  # 删除域名代理
```

**请求示例**:
```bash
# 注册域名
curl "https://your-edge-proxy.com/target/example.com"

# 删除域名
curl -X DELETE "https://your-edge-proxy.com/target/example.com"
```

**自定义代理目标**:
```bash
curl "https://your-edge-proxy.com/target/mydomain.com" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://backend.example.com:8080",
    "expirationTtl": 86400
  }'
```

### 查看已注册域名
```
GET /list
```
返回所有已注册的代理域名及其配置信息。

### 代理请求
```
GET /{domain}/*          # 直接代理到域名
GET /proxy/{domain}/*    # 代理到已注册的域名
```

**使用示例**:
```bash
# 直接代理 (无需预注册)
curl "https://your-edge-proxy.com/httpbin.org/get"

# 代理到已注册域名
curl "https://your-edge-proxy.com/proxy/example.com/api/users"
```

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/akirco/edgeproxy.git
cd edgeproxy
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 本地开发
```bash
pnpm dev
```

### 4. 部署到 EdgeOne Pages
1. 在 [Tencent Cloud EdgeOne](https://console.cloud.tencent.com/edgeone) 创建 Pages 项目
2. 配置 KV 存储命名空间 `PROXY_MAP`
3. 上传项目文件并部署

## 配置说明

### 环境变量
项目使用 EdgeOne Pages 的 KV 存储，需要绑定名为 `PROXY_MAP` 的 KV 命名空间。

### 配置参数
在 [`config.js`](file:///e:/projects/openplan/edgeproxy/functions/config.js) 中可以修改：

- `DEFAULT_TTL`: 默认缓存时间 (30天)
- `PROXY.MAX_REDIRECTS`: 最大重定向次数 (5次)
- `PROXY.TIMEOUT`: 请求超时时间 (30秒)
- `PROXY.MAX_BODY_SIZE`: 最大请求体大小 (20GB)

## 使用场景

- **API 网关**: 为多个后端服务提供统一入口
- **跨域代理**: 解决前端跨域访问问题
- **负载均衡**: 动态切换后端服务地址
- **开发调试**: 代理到本地开发环境
- **服务聚合**: 将多个服务整合到一个域名下

## 技术栈

- **运行时**: EdgeOne Pages (Cloudflare Workers 兼容)
- **存储**: Tencent Cloud KV 存储
- **语言**: JavaScript (ES Modules)
- **部署**: Tencent Cloud EdgeOne

## 许可证

MIT License

## 作者

[akirco](https://github.com/akirco)

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 本项目基于 Tencent Cloud EdgeOne Pages 构建，使用前请确保已开通相关服务。
