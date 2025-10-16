# MonoDog 🚀

A comprehensive, self-hosted monorepo package manager dashboard that provides visual management and monitoring of packages using tools like pnpm, turbo, or Nx.

## ✨ Features

### 📦 Package Overview Dashboard
- **Complete Package List**: View all packages in your monorepo with detailed information
- **Version Management**: Track current versions, dependencies, and maintainers
- **Real-time Status**: Monitor package health and build status
- **Search & Filtering**: Find packages by name, type, maintainer, or tags

### 🔗 Dependency Graph Visualization
- **Interactive DAG**: Visual representation of inter-package dependencies
- **Hover & Click**: Inspect versions, changes, and impact on hover/click
- **Dual Views**: Switch between visual graph and detailed list views
- **Circular Detection**: Identify and highlight circular dependencies

### 📈 Package Health & Status
- **Build Status**: Monitor CI/CD pipeline status for each package
- **Test Coverage**: Track test coverage and results
- **Lint Status**: Monitor code quality and linting results
- **Security Audits**: Track security vulnerabilities and updates
- **Health Scoring**: Overall package health metrics (0-100%)

### 📤 Publish & Versioning Control
- **Semantic Versioning**: Trigger version bumps from the UI
- **Changelog Management**: View recent commits and changes per package
- **Dependency Updates**: Identify and update outdated dependencies
- **Release Management**: Streamline package publishing workflows

### 🔍 Advanced Search & Filters
- **Multi-criteria Search**: Filter by package name, type, maintainer, or tags
- **Status-based Filtering**: Filter by health status, build status, or dependency status
- **Real-time Results**: Instant search results with highlighting

### 🧪 CI/CD Integration
- **Multi-provider Support**: GitHub Actions, GitLab CI, CircleCI, Jenkins, and more
- **Build Monitoring**: Real-time build status and logs
- **Artifact Management**: Access build artifacts and test results
- **Trigger Builds**: Manually trigger builds from the dashboard

### ⚙️ Configuration Inspector
- **Package Scripts**: View and manage npm scripts
- **Configuration Files**: Compare configs across packages
- **Dependency Analysis**: Deep dive into package dependencies
- **Health Metrics**: Comprehensive package health analysis

### 👥 Access Control (Optional)
- **Role-based Access**: Admin/users with specific permissions
- **Package-level Security**: Control access to specific packages
- **Audit Logging**: Track all dashboard actions and changes

## 🏗️ Architecture

```
monovisor/
├── apps/
│   └── dashboard/          # React frontend dashboard
├── packages/
│   ├── backend/            # Express.js API server
│   ├── monorepo-scanner/   # Package analysis engine
│   └── ci-status/          # CI/CD integration manager
├── libs/
│   └── utils/              # Shared utility functions
├── prisma/                 # Database schema and migrations
├── scripts/                # Utility scripts and automation
└── docker/                 # Containerization support
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- PostgreSQL (for production) or SQLite (for development)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd monovisor
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your database
DATABASE_URL="postgresql://user:password@localhost:5432/monovisor"
# or for SQLite: DATABASE_URL="file:./dev.db"
```

### 3. Database Setup
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Or run migrations
pnpm db:migrate
```

### 4. Start Development
```bash
# Start all services
pnpm dev

# Or start individually:
pnpm --filter @monovisor/dashboard dev    # Frontend (http://localhost:5173)
pnpm --filter @monovisor/backend dev     # Backend (http://localhost:4000)
```

### 5. Access Dashboard
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Configuration

### Dashboard Configuration
The dashboard can be configured through environment variables or configuration files:

```env
# Dashboard settings
DASHBOARD_PORT=5173
DASHBOARD_HOST=localhost

# Backend API
API_BASE_URL=http://localhost:4000

# CI Providers
GITHUB_TOKEN=your_github_token
GITLAB_TOKEN=your_gitlab_token
CIRCLECI_TOKEN=your_circleci_token
```

### CI Provider Setup
Configure your CI providers in the dashboard:

1. **GitHub Actions**: Add your GitHub personal access token
2. **GitLab CI**: Configure GitLab API access
3. **CircleCI**: Set up CircleCI API token
4. **Custom Providers**: Add custom CI endpoints

## 📊 Usage Examples

### Package Management
```bash
# Scan monorepo for packages
pnpm refresh

# Export scan results
pnpm refresh --export json --output scan-results.json

# Health check only
pnpm refresh --no-scan --no-ci --no-deps
```

### API Endpoints
```bash
# Get all packages
curl http://localhost:4000/api/packages

# Get package details
curl http://localhost:4000/api/packages/dashboard

# Get dependency graph
curl http://localhost:4000/api/graph

# Get CI status
curl http://localhost:4000/api/ci/status

# Trigger build
curl -X POST http://localhost:4000/api/ci/trigger \
  -H "Content-Type: application/json" \
  -d '{"packageName": "dashboard", "branch": "main"}'
```

## 🐳 Docker Deployment

### Quick Docker Compose
```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Custom Docker Setup
```bash
# Build images
docker build -t monovisor-dashboard ./apps/dashboard
docker build -t monovisor-backend ./packages/backend

# Run containers
docker run -p 5173:5173 monovisor-dashboard
docker run -p 4000:4000 monovisor-backend
```

## 🔍 Monitoring & Health Checks

### Health Endpoints
- **Frontend**: `http://localhost:5173/health`
- **Backend**: `http://localhost:4000/api/health`
- **Database**: Prisma health check integration

### Metrics & Logging
- **Application Logs**: Structured logging with different levels
- **Performance Metrics**: Response times, error rates, throughput
- **Health Dashboards**: Real-time system health monitoring

## 🧪 Testing

### Run Tests
```bash
# All tests
pnpm test

# Specific package tests
pnpm --filter @monovisor/backend test
pnpm --filter @monovisor/dashboard test

# Test with coverage
pnpm test --coverage
```

### Test Structure
```
├── __tests__/              # Test files
├── __mocks__/              # Mock data and functions
├── test-utils/             # Test utilities and helpers
└── coverage/               # Coverage reports
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/monovisor
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### Performance Optimization
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery optimization
- **Load Balancing**: Multiple backend instances
- **Database**: Connection pooling and query optimization

### Security Considerations
- **HTTPS**: SSL/TLS encryption
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting and protection

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run the test suite: `pnpm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **pnpm**: Fast, disk space efficient package manager
- **Turbo**: High-performance build system
- **Prisma**: Next-generation ORM
- **React**: UI library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/monovisor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/monovisor/discussions)
- **Documentation**: [Wiki](https://github.com/your-org/monovisor/wiki)

---

**Monovisor** - Making monorepo management simple, visual, and powerful! 🎯
