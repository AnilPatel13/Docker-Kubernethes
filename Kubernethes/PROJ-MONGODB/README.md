# MongoDB Persistent Data Project

A comprehensive Kubernetes project demonstrating persistent data storage with MongoDB StatefulSet and a Color API application. This project showcases database integration, persistent volumes, and RESTful API development in a containerized environment.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Components](#components)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Deployment Guide](#deployment-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This project implements a complete data persistence solution using:
- **MongoDB StatefulSet** for reliable database storage
- **Persistent Volume Claims** for data persistence across pod restarts
- **Headless Service** for stable network identities
- **Color API v2.0** with MongoDB integration using Mongoose
- **ConfigMaps and Secrets** for secure configuration management

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Kubernetes Cluster - Default Namespace"
        subgraph "External Access"
            USER[External User/Developer]
            NODEPORT[NodePort Service<br/>color-svc]
        end
        
        subgraph "Application Layer"
            API[Color API Deployment<br/>color-api]
        end
        
        subgraph "Database Layer"
            HEADLESS[Headless Service<br/>mongodb-svc]
            STATEFUL[MongoDB StatefulSet<br/>mongodb-ss]
            PVC[Persistent Volume Claim<br/>mongodb-data]
        end
        
        subgraph "Configuration Layer"
            CM[ConfigMap<br/>mongodb-init-colordb]
            S1[Secret<br/>mongodb-root-creds]
            S2[Secret<br/>mongodb-colordb-creds]
        end
        
        subgraph "Storage Layer"
            SC[Storage Class<br/>hostpath]
            PV[Persistent Volume<br/>Auto-provisioned]
        end
    end
    
    USER --> NODEPORT
    NODEPORT --> API
    API --> HEADLESS
    HEADLESS --> STATEFUL
    STATEFUL --> PVC
    PVC --> SC
    SC --> PV
    
    CM --> STATEFUL
    S1 --> STATEFUL
    S2 --> STATEFUL
    S2 --> API
    
    style USER fill:#e3f2fd
    style API fill:#fff3e0
    style STATEFUL fill:#e8f5e8
    style PVC fill:#fce4ec
    style CM fill:#f3e5f5
    style S1 fill:#fff8e1
    style S2 fill:#fff8e1
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant Client
    participant NodePort as NodePort Service
    participant API as Color API
    participant Headless as Headless Service
    participant MongoDB as MongoDB Pod
    participant PV as Persistent Volume
    
    Client->>NodePort: HTTP Request
    NodePort->>API: Forward Request
    API->>Headless: Database Query
    Headless->>MongoDB: Route to Pod
    MongoDB->>PV: Read/Write Data
    PV-->>MongoDB: Data Response
    MongoDB-->>Headless: Query Result
    Headless-->>API: Database Response
    API-->>NodePort: HTTP Response
    NodePort-->>Client: Final Response
```

## 📁 Project Structure

```
PROJ-MONGODB/
├── Color Api/
│   ├── src/
│   │   ├── db/
│   │   │   └── color.js           # MongoDB schema and operations
│   │   ├── routes/
│   │   │   ├── api.js             # API route handlers
│   │   │   ├── health.js          # Health check endpoints
│   │   │   └── root.js            # Root route handler
│   │   ├── index.js               # Main application entry point
│   │   └── utils.js               # Utility functions
│   ├── Dockerfile                 # Container image definition
│   ├── package.json               # Node.js dependencies
│   ├── Build.ipynb               # Build process notebook
│   └── implement.ipynb           # Implementation examples
├── color-api.yaml                 # Color API deployment
├── color-svc.yaml                 # NodePort service for API
├── mondodb-statefullset.yaml      # MongoDB StatefulSet
├── mongodb-svc.yaml               # MongoDB headless service
├── mongo-root-creds.yaml          # MongoDB root credentials
├── mongo-colordb-creds.yaml       # Application database credentials
├── mongodb-init-db.yaml           # Database initialization script
├── traffic-genrator-pod.yaml      # Load testing pod
├── proj.ipynb                     # Project implementation notebook
└── README.md                      # This file
```

## 🧩 Components

### MongoDB StatefulSet

<details>
<summary>Click to expand MongoDB StatefulSet details</summary>

**Configuration:**
- **Image**: `mongo:8.0.0`
- **Replicas**: 1 (can be scaled)
- **Storage**: 5Gi persistent volume
- **Storage Class**: hostpath (Minikube default)

**Key Features:**
- Stable network identity via headless service
- Persistent data storage across pod restarts
- Automatic database initialization
- Secure credential management

**Environment Variables:**
- `MONGO_INITDB_ROOT_USERNAME`: Root user from secret
- `MONGO_INITDB_ROOT_PASSWORD`: Root password from secret
- `DB_NAME`: Application database name (colordb)
- `DB_USER`: Application user from secret
- `DB_PASSWORD`: Application password from secret

**Volume Mounts:**
- `/data/db`: MongoDB data directory (persistent)
- `/docker-entrypoint-initdb.d`: Initialization scripts

</details>

### Color API Application

<details>
<summary>Click to expand Color API details</summary>

**Technology Stack:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ODM**: Mongoose
- **Body Parser**: body-parser

**Key Features:**
- RESTful API design
- MongoDB integration with Mongoose
- Environment-based configuration
- Health check endpoints
- Graceful error handling

**Database Connection:**
```javascript
mongoose.connect(process.env.DB_URL)
```

**Connection String Format:**
```
mongodb://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)
```

</details>

### Configuration Management

<details>
<summary>Click to expand configuration details</summary>

#### Secrets
1. **mongodb-root-creds**: MongoDB root user credentials
2. **mongodb-colordb-creds**: Application database user credentials

#### ConfigMaps
1. **mongodb-init-colordb**: Database initialization script

#### Database Initialization Script
```javascript
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

db = db.getSiblingDB(dbName);
db.createUser({
  user: dbUser,
  pwd: dbPassword,
  roles: [{ role: "readWrite", db: dbName }]
});
```

</details>

## 📚 API Documentation

### Base URL
```
http://localhost:<NodePort>
```

### API Endpoints

<details>
<summary>Click to expand API endpoint details</summary>

#### 1. Get Color with Query Parameter
**Endpoint:** `GET /api?colorkey={key}&format={format}`

**Description:** Retrieves a color by key or returns default color

**Parameters:**
- `colorkey` (optional): Color key to retrieve
- `format` (optional): Response format (`json` or `text`)

**Response Examples:**
```json
// JSON format
{
  "color": "red",
  "hostname": "color-api-7d8f9b5c6d-xyz12"
}
```

```text
// Text format
COLOR : red, HOSTNAME : color-api-7d8f9b5c6d-xyz12
```

**Use Cases:**
- Get specific color by key
- Get default color when key not found
- Retrieve hostname for load balancing verification

</details>

<details>
<summary>Click to expand more API endpoints</summary>

#### 2. Get All Colors
**Endpoint:** `GET /api/color`

**Description:** Retrieves all stored colors from the database

**Response:**
```json
{
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "key": "primary",
      "value": "blue",
      "__v": 0
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "key": "secondary",
      "value": "green",
      "__v": 0
    }
  ]
}
```

**Use Cases:**
- List all available colors
- Admin dashboard data
- Color palette management

#### 3. Get Specific Color
**Endpoint:** `GET /api/color/:key`

**Description:** Retrieves a specific color by key

**Parameters:**
- `key` (path): Color key to retrieve

**Response:**
```json
// Success (200)
{
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "key": "primary",
    "value": "blue",
    "__v": 0
  }
}

// Not Found (404)
// Empty response with 404 status
```

**Use Cases:**
- Validate color existence
- Get detailed color information
- Color-specific operations

#### 4. Create/Update Color
**Endpoint:** `POST /api/color/:key`

**Description:** Creates a new color or updates existing one

**Parameters:**
- `key` (path): Color key to create/update

**Request Body:**
```json
{
  "value": "red"
}
```

**Response:**
```json
// Success (201)
{
  "data": {
    "key": "primary",
    "value": "red"
  }
}
```

**Behavior:**
- Creates new color if key doesn't exist
- Updates existing color if key exists
- Upsert operation using Mongoose

**Use Cases:**
- Add new color themes
- Update existing color values
- Bulk color management

#### 5. Delete Color
**Endpoint:** `DELETE /api/color/:key`

**Description:** Deletes a color by key

**Parameters:**
- `key` (path): Color key to delete

**Response:**
- **Status Code:** 204 (No Content)
- **Body:** Empty

**Use Cases:**
- Remove obsolete colors
- Clean up test data
- Color management operations

</details>

### Health Check Endpoints

<details>
<summary>Click to expand health check details</summary>

#### Health Endpoints
- `GET /health` - Liveness probe
- `GET /ready` - Readiness probe  
- `GET /up` - Basic health check

**Response:**
```text
ok
```

**Use Cases:**
- Kubernetes liveness probes
- Kubernetes readiness probes
- Load balancer health checks
- Monitoring and alerting

</details>

## 🚀 Getting Started

### Prerequisites
- Kubernetes cluster (Minikube recommended)
- kubectl configured
- Docker (for custom builds)

### Quick Start

<details>
<summary>Click to expand quick start guide</summary>

1. **Clone and navigate to project:**
   ```bash
   cd "PROJ-MONGODB"
   ```

2. **Deploy MongoDB infrastructure:**
   ```bash
   # Create secrets
   kubectl apply -f mongo-root-creds.yaml
   kubectl apply -f mongo-colordb-creds.yaml
   
   # Create ConfigMap
   kubectl apply -f mongodb-init-db.yaml
   
   # Deploy MongoDB
   kubectl apply -f mongodb-svc.yaml
   kubectl apply -f mondodb-statefullset.yaml
   ```

3. **Deploy Color API:**
   ```bash
   kubectl apply -f color-api.yaml
   kubectl apply -f color-svc.yaml
   ```

4. **Verify deployment:**
   ```bash
   kubectl get pods
   kubectl get svc
   kubectl get pvc
   ```

</details>

## 📖 Deployment Guide

### Step-by-Step Deployment

<details>
<summary>Click to expand detailed deployment steps</summary>

#### Phase 1: Storage and Configuration
```bash
# 1. Create MongoDB root credentials
kubectl apply -f mongo-root-creds.yaml

# 2. Create application database credentials  
kubectl apply -f mongo-colordb-creds.yaml

# 3. Create database initialization ConfigMap
kubectl apply -f mongodb-init-db.yaml

# Verify configuration
kubectl get secrets,configmaps
```

#### Phase 2: Database Deployment
```bash
# 1. Deploy headless service (must be first)
kubectl apply -f mongodb-svc.yaml

# 2. Deploy StatefulSet
kubectl apply -f mondodb-statefullset.yaml

# 3. Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=300s

# 4. Verify persistent volume creation
kubectl get pvc,pv
```

#### Phase 3: Application Deployment
```bash
# 1. Deploy Color API
kubectl apply -f color-api.yaml

# 2. Deploy NodePort service
kubectl apply -f color-svc.yaml

# 3. Wait for API to be ready
kubectl wait --for=condition=ready pod -l app=color-api --timeout=300s

# 4. Get service URL
kubectl get svc color-svc
```

#### Phase 4: Verification
```bash
# Check all resources
kubectl get all

# Check logs
kubectl logs -l app=mongodb
kubectl logs -l app=color-api

# Test connectivity
kubectl exec -it deployment/color-api -- curl http://localhost/up
```

</details>

### Database Connection Details

<details>
<summary>Click to expand database connection information</summary>

**Connection Components:**
- **Host**: `mongodb-ss-0.mongodb-svc.default.svc.cluster.local`
- **Port**: `27017`
- **Database**: `colordb`
- **Authentication**: Username/password from secrets

**Full Connection String:**
```
mongodb://$(DB_USER):$(DB_PASSWORD)@mongodb-ss-0.mongodb-svc.default.svc.cluster.local:27017/colordb
```

**DNS Resolution:**
- `mongodb-ss-0`: StatefulSet pod name
- `mongodb-svc`: Headless service name
- `default`: Namespace
- `svc.cluster.local`: Kubernetes DNS suffix

</details>

## 🧪 Testing

### API Testing Examples

<details>
<summary>Click to expand testing examples</summary>

#### Get Service URL
```bash
# Get NodePort
kubectl get svc color-svc
# Note the NodePort (e.g., 30080)

# For Minikube
minikube service color-svc --url
```

#### Test API Endpoints
```bash
# Set base URL (replace with your NodePort)
BASE_URL="http://localhost:30080"

# 1. Health check
curl $BASE_URL/up

# 2. Get default color
curl "$BASE_URL/api"

# 3. Get all colors
curl "$BASE_URL/api/color"

# 4. Create a color
curl -X POST "$BASE_URL/api/color/primary" \
  -H "Content-Type: application/json" \
  -d '{"value": "blue"}'

# 5. Get specific color
curl "$BASE_URL/api/color/primary"

# 6. Get color with query parameter
curl "$BASE_URL/api?colorkey=primary&format=json"

# 7. Update color
curl -X POST "$BASE_URL/api/color/primary" \
  -H "Content-Type: application/json" \
  -d '{"value": "red"}'

# 8. Delete color
curl -X DELETE "$BASE_URL/api/color/primary"

# 9. Verify deletion (should return 404)
curl -w "%{http_code}" "$BASE_URL/api/color/primary"
```

</details>

### Load Testing

<details>
<summary>Click to expand load testing setup</summary>

#### Deploy Traffic Generator
```bash
kubectl apply -f traffic-genrator-pod.yaml
```

#### Generate Load
```bash
# Execute load test
kubectl exec -it traffic-generator -- /bin/bash

# Inside the pod, run load tests
for i in {1..100}; do
  curl -X POST "http://color-svc/api/color/test$i" \
    -H "Content-Type: application/json" \
    -d "{\"value\": \"color$i\"}"
done

# Verify data persistence
curl "http://color-svc/api/color" | jq '.data | length'
```

</details>

## 🔧 Troubleshooting

### Common Issues

<details>
<summary>Click to expand troubleshooting guide</summary>

#### MongoDB Connection Issues
```bash
# Check MongoDB pod status
kubectl get pods -l app=mongodb

# Check MongoDB logs
kubectl logs mongodb-ss-0

# Verify secrets
kubectl get secret mongodb-root-creds -o yaml
kubectl get secret mongodb-colordb-creds -o yaml

# Test MongoDB connectivity
kubectl exec -it mongodb-ss-0 -- mongosh --eval "db.adminCommand('ping')"
```

#### API Connection Issues
```bash
# Check API pod status
kubectl describe pod -l app=color-api

# Check API logs
kubectl logs -l app=color-api

# Test internal connectivity
kubectl exec -it deployment/color-api -- curl http://localhost/up

# Check environment variables
kubectl exec -it deployment/color-api -- env | grep DB_
```

#### Persistent Volume Issues
```bash
# Check PVC status
kubectl get pvc

# Check PV status
kubectl get pv

# Check storage class
kubectl get storageclass

# For Minikube, ensure hostpath provisioner is enabled
minikube addons list | grep storage-provisioner
```

#### Service Discovery Issues
```bash
# Test DNS resolution
kubectl exec -it deployment/color-api -- nslookup mongodb-svc

# Check service endpoints
kubectl get endpoints mongodb-svc

# Verify headless service
kubectl describe svc mongodb-svc
```

</details>

### Debugging Commands

<details>
<summary>Click to expand debugging commands</summary>

```bash
# Resource inspection
kubectl get all -o wide
kubectl describe statefulset mongodb-ss
kubectl describe deployment color-api

# Network debugging
kubectl exec -it deployment/color-api -- netstat -tlnp
kubectl exec -it mongodb-ss-0 -- netstat -tlnp

# Database debugging
kubectl exec -it mongodb-ss-0 -- mongosh colordb --eval "db.colors.find()"

# Log analysis
kubectl logs mongodb-ss-0 --previous
kubectl logs -l app=color-api --tail=100

# Resource cleanup
kubectl delete -f .
kubectl delete pvc --all
```

</details>

## 📊 Monitoring and Metrics

### Key Metrics to Monitor

<details>
<summary>Click to expand monitoring details</summary>

#### Application Metrics
- API response times
- Database connection pool status
- Error rates and types
- Request volume patterns

#### Infrastructure Metrics
- Pod CPU and memory usage
- Persistent volume utilization
- Network I/O patterns
- Database query performance

#### Monitoring Commands
```bash
# Resource usage
kubectl top pods
kubectl top nodes

# Persistent volume usage
kubectl exec -it mongodb-ss-0 -- df -h /data/db

# Connection monitoring
kubectl exec -it mongodb-ss-0 -- mongosh --eval "db.serverStatus().connections"
```

</details>

## 🔒 Security Considerations

<details>
<summary>Click to expand security guidelines</summary>

### Database Security
- Use strong passwords in secrets
- Enable MongoDB authentication
- Implement network policies
- Regular security updates

### Application Security
- Validate input data
- Implement rate limiting
- Use HTTPS in production
- Monitor for suspicious activity

### Kubernetes Security
- Apply Pod Security Standards
- Use RBAC for access control
- Enable audit logging
- Regular cluster updates

</details>

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM Guide](https://mongoosejs.com/docs/guide.html)
- [Kubernetes StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Express.js Documentation](https://expressjs.com/)

---

**Note**: This project demonstrates production-ready patterns for persistent data storage in Kubernetes. Always follow security best practices and perform thorough testing before deploying to production environments.