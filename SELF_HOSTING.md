# 🚀 Self-Hosting Monovisor Dashboard

Monovisor is designed to be easily self-hosted in any monorepo setup. This guide will walk you through the complete setup process.

## 📋 Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Git** for version control
- **Database** (PostgreSQL recommended, SQLite for development)
- **CI/CD Provider** (GitHub Actions, GitLab CI, etc.) - optional

## 🏗️ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/monovisor.git
cd monovisor

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env with your settings
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="sql://username:password@localhost:5432/monovisor"

# Dashboard
DASHBOARD_PORT=3000
DASHBOARD_HOST=localhost

# Backend API
BACKEND_PORT=3001
BACKEND_HOST=localhost
```

### 3. Database Setup

```bash
# Create database (PostgreSQL)
createdb monovisor

# Run migrations
pnpm db:migrate

# Or push schema (development)
pnpm db:push
```

### 4. Start Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter @monovisor/dashboard dev    # Frontend (port 3000)
pnpm --filter @monovisor/backend dev      # Backend API (port 3001)
```

## 🔧 Configuration

### Dashboard Customization

The dashboard is highly configurable through the UI:

1. **General Settings**
   - Dashboard title and description
   - Package types (app, lib, tool, service, etc.)
   - Custom fields for packages

2. **Feature Toggles**
   - Health checks
   - CI/CD integration
   - Dependency graph
   - Publish control
   - Search and filtering

3. **Branding**
   - Custom logo
   - Primary and secondary colors
   - Company branding

4. **Monorepo Structure**
   - Package manager (pnpm, npm, yarn, lerna, nx)
   - Directory structure
   - Ignore patterns

### Monorepo Structure Detection

Monovisor automatically detects common monorepo structures:

```
Standard Structure:
├── apps/          # Applications
├── packages/      # Shared packages
└── libs/          # Libraries

Custom Structure:
├── frontend/      # Custom directories
├── backend/
├── shared/
└── tools/
```

## 📦 Package Manager Support

### pnpm (Recommended)
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'libs/*'
```

### npm
```json
// package.json
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "libs/*"
  ]
}
```

### Yarn
```yaml
# package.json
{
  "workspaces": {
    "packages": [
      "apps/*",
      "packages/*",
      "libs/*"
    ]
  }
}
```

### Lerna
```json
// lerna.json
{
  "packages": [
    "apps/*",
    "packages/*",
    "libs/*"
  ]
}
```

### Nx
```json
// nx.json
{
  "workspaceLayout": {
    "appsDir": "apps",
    "libsDir": "libs"
  }
}
```

## 🧪 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build

test:
  stage: test
  image: node:18
  script:
    - npm install -g pnpm
    - pnpm install
    - pnpm test

build:
  stage: build
  image: node:18
  script:
    - npm install -g pnpm
    - pnpm install
    - pnpm build
```

## 🐳 Docker Deployment

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: monovisor
      POSTGRES_USER: monovisor
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  dashboard:
    build:
      context: .
      dockerfile: apps/dashboard/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://monovisor:password@postgres:5432/monovisor
    depends_on:
      - postgres

  backend:
    build:
      context: .
      dockerfile: packages/backend/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://monovisor:password@postgres:5432/monovisor
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Dockerfile Example
```dockerfile
# apps/dashboard/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/*/package.json ./packages/
COPY libs/*/package.json ./libs/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build dashboard
RUN pnpm --filter @monovisor/dashboard build

# Expose port
EXPOSE 3000

# Start dashboard
CMD ["pnpm", "--filter", "@monovisor/dashboard", "start"]
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong, unique passwords
- Rotate secrets regularly
- Use environment-specific configurations

### Database Security
- Use dedicated database user
- Restrict network access
- Enable SSL connections
- Regular backups

### Network Security
- Use HTTPS in production
- Configure CORS properly
- Rate limiting
- Input validation

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Check dashboard health
curl http://localhost:3000/api/health

# Check backend health
curl http://localhost:3001/api/health

# Check database connection
pnpm db:studio
```

### Logs
```bash
# Dashboard logs
pnpm --filter @monovisor/dashboard logs

# Backend logs
pnpm --filter @monovisor/backend logs

# Database logs
docker logs monovisor_postgres_1
```

### Backup
```bash
# Database backup
pg_dump monovisor > backup_$(date +%Y%m%d).sql

# Configuration backup
cp .env .env.backup
cp -r config/ config.backup/
```

## 🚀 Production Deployment

### 1. Build Production Assets
```bash
pnpm build
```

### 2. Environment Setup
```bash
# Production environment
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@prod-db:5432/monovisor"
DASHBOARD_URL="https://dashboard.yourcompany.com"
BACKEND_URL="https://api.yourcompany.com"
```

### 3. Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start ecosystem.config.js

# Using systemd
sudo systemctl enable monovisor
sudo systemctl start monovisor
```

### 4. Reverse Proxy (Nginx)
```nginx
# /etc/nginx/sites-available/monovisor
server {
    listen 80;
    server_name dashboard.yourcompany.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name dashboard.yourcompany.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Test connection
   psql -h localhost -U monovisor -d monovisor
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Build Failures**
   ```bash
   # Clear cache
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x scripts/*.sh
   ```

### Getting Help

- Check the [GitHub Issues](https://github.com/your-username/monovisor/issues)
- Review the [Documentation](https://monovisor.dev)
- Join our [Discord Community](https://discord.gg/monovisor)

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer for multiple dashboard instances
- Database read replicas
- Redis for caching
- CDN for static assets

### Performance Optimization
- Database indexing
- Query optimization
- Asset compression
- Lazy loading

### Monitoring
- Application performance monitoring (APM)
- Infrastructure monitoring
- Log aggregation
- Alerting systems

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Monorepo Management! 🎉**

If you find this project helpful, please consider giving it a ⭐ on GitHub!
