# 🐳 Docker Compose

> **Multi-container orchestration with animated service management**

## 📁 Project Files
- `app.py` - Flask web application 🐍
- `Dockerfile` - Container build config 📦
- `docker-compose.yml` - Service orchestration 🎼
- `requirements.txt` - Python dependencies 📋
- `docker build.ipynb` - Interactive commands 📝

---

## 🎼 Docker Compose Workflow

```mermaid
flowchart TD
    A[📁 docker-compose.yml] --> B[🔨 docker compose build]
    B --> C[🚀 docker compose up]
    C --> D[🔄 Services Running]
    D --> E[📥 Registry Sync]
    E --> F[⏹️ docker compose stop]
    
    subgraph "Service Management"
        G[🌐 Network Creation]
        H[📦 Container Deployment]
        I[📡 Port Mapping]
    end
    
    C --> G
    G --> H
    H --> I
    I --> D
    
    style A fill:#e8f5e8
    style D fill:#c8e6c9
    style F fill:#ffcdd2
```

## 🎬 Animated Orchestration Flow

### Step 1: 🔨 Build Services
```bash
docker compose build
```

```
🔨 Building Services...

┌───────────────────────────────────┐
│  🎼 Service: web                 │
│  📦 Building from Dockerfile     │
│  ██████████ 100% Complete      │
│  ✅ Build successful             │
└───────────────────────────────────┘
```

### Step 2: 🚀 Start Services
```bash
docker compose up
```

```
🚀 Starting Multi-Container Application...

🌐 Network Creation:
    ✅ Creating network "docker-compose_default"
    
📦 Container Startup:
    ✅ Creating web_1...
    ✅ Starting web_1... done
    
📡 Port Mapping:
    web_1 | 🌐 Running on http://0.0.0.0:5000
    ✅ Service accessible on localhost:5000
```

### Step 3: 🔄 Background Mode
```bash
docker compose up -d
```

```
🔄 Detached Mode Activation:

    🎼 Services running in background...
    
    ┌──────────────────────────────────┐
    │  🐳 Container: web_1            │
    │  🟢 Status: Running              │
    │  🌐 Port: 5000:5000             │
    │  🔗 URL: http://localhost:5000  │
    └──────────────────────────────────┘
```

### Step 4: 📥 Registry Operations
```bash
docker push anil1318/web-app-compose:latest
docker compose pull web
```

```
📥 Registry Sync:

⬆️  Push to Registry:
    ██████████ Uploading layers...
    ✅ anil1318/web-app-compose:latest pushed
    
⬇️  Pull Latest Version:
    ██████████ Downloading updates...
    ✅ Service 'web' updated
```

### Step 5: ⏹️ Service Management
```bash
docker compose stop
```

```
⏹️  Graceful Shutdown:

    🔄 Stopping services...
    ✅ web_1 stopped
    
    🌐 Network cleanup...
    ✅ Network removed
    
    📊 Resource summary:
    • Containers: 0 running
    • Networks: 0 active
    • Volumes: 0 mounted
```

## 🔄 Service Orchestration

```mermaid
sequenceDiagram
    participant User as User
    participant Compose as Docker Compose
    participant Network as Docker Network
    participant Container as Web Container
    participant Registry as Docker Hub
    
    User->>Compose: docker compose build
    Compose->>Container: Build web service
    Container-->>Compose: Build complete
    
    User->>Compose: docker compose up -d
    Compose->>Network: Create network
    Network-->>Compose: Network ready
    Compose->>Container: Start web service
    Container-->>Compose: Service running
    
    User->>Registry: docker push image
    Registry-->>User: Image stored
    
    User->>Compose: docker compose pull web
    Compose->>Registry: Pull latest image
    Registry-->>Compose: Image downloaded
    
    User->>Compose: docker compose stop
    Compose->>Container: Stop services
    Container-->>Compose: Services stopped
    Compose->>Network: Remove network
    Network-->>Compose: Network cleaned
```

## 🌐 Multi-Container Architecture

```mermaid
graph TB
    subgraph "Docker Compose Stack"
        subgraph "Host Network"
            A[localhost:5000]
        end
        
        subgraph "Docker Network"
            B[compose_default]
            
            subgraph "Web Service"
                C[Flask Container]
                D[Port 5000]
                E[Volume Mounts]
            end
        end
        
        subgraph "External Services"
            F[Docker Hub Registry]
            G[Image Repository]
        end
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    F --> G
    G --> C
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style F fill:#fce4ec
```

---

## 🎼 Service Architecture

```
🌐 Docker Compose Stack:

┌──────────────────────────────────────────────────┐
│                    🌐 Host Network                    │
│  ┌──────────────────────────────────────────┐  │
│  │          🐳 Docker Compose Network          │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │        🐍 Flask Web Service        │  │  │
│  │  │        Port: 5000 → 5000           │  │  │
│  │  │        Image: web-app-compose      │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## 📈 Orchestration Progress

```
Compose Lifecycle:

📁 Config → 🔨 Build → 🚀 Deploy → 🔄 Scale → ⏹️ Stop

[████████████████████] 100% Orchestrated

✅ Services defined
✅ Images built
✅ Containers deployed
✅ Network configured
✅ Registry synchronized
```

## 🎯 Compose Features
- **Multi-Service**: Orchestrate multiple containers 🎼
- **Networking**: Automatic service discovery 🌐
- **Scaling**: Easy horizontal scaling 📈
- **Volumes**: Persistent data management 💾
- **Environment**: Configuration management ⚙️