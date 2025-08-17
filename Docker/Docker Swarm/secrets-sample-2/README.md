# Docker Swarm Secrets Sample 2

## Overview
Advanced Docker Swarm secrets demonstration with multiple secrets and Docker Compose integration for PostgreSQL database deployment.

## Files
- `docker-compose.yml` - Swarm stack with secrets configuration
- `psql_password.txt` - PostgreSQL password secret
- `psql_user.txt` - PostgreSQL username secret

<details>
<summary>📋 Advanced Secrets</summary>

### Purpose
- Multi-secret management
- Compose file secrets integration
- Database security best practices
- Production-ready secret handling

### Architecture
```mermaid
graph TB
    A[Secret Files] --> B[Docker Secrets]
    B --> C[Compose Stack]
    C --> D[PostgreSQL Service]
    D --> E[Secret Mount Points]
    
    subgraph "Secrets Flow"
        F[psql_user.txt]
        G[psql_password.txt]
        H[/run/secrets/psql_user]
        I[/run/secrets/psql_password]
    end
    
    F --> H
    G --> I
    H --> J[Database Init]
    I --> J
    
    subgraph "Security Layers"
        K[File Encryption]
        L[Network Encryption]
        M[Access Control]
        N[Audit Logging]
    end
```

</details>

<details>
<summary>🚀 Deployment Guide</summary>

### Stack Deployment
```bash
# Deploy stack with secrets
docker stack deploy -c docker-compose.yml postgres-stack

# Verify secrets creation
docker secret ls

# Check service status
docker stack services postgres-stack
docker service ps postgres-stack_db

# Connect to database
docker exec -it $(docker ps -q -f name=postgres-stack_db) \
  psql -U $(cat psql_user.txt) -d postgres
```

### Secret Management
```bash
# Update secrets (requires service recreation)
echo "newpassword" | docker secret create psql_password_v2 -
docker service update --secret-rm psql_password \
  --secret-add psql_password_v2 postgres-stack_db

# Rotate secrets safely
docker service update --secret-add new_secret postgres-stack_db
# Update application to use new secret
docker service update --secret-rm old_secret postgres-stack_db
```

</details>

<details>
<summary>⚙️ Configuration Details</summary>

### Compose File Structure
```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    secrets:
      - psql_user
      - psql_password
    environment:
      POSTGRES_USER_FILE: /run/secrets/psql_user
      POSTGRES_PASSWORD_FILE: /run/secrets/psql_password
      POSTGRES_DB: myapp
    deploy:
      replicas: 1
      placement:
        constraints: [node.role == manager]

secrets:
  psql_user:
    file: ./psql_user.txt
  psql_password:
    file: ./psql_password.txt
```

### Environment Integration
- Secrets mounted at `/run/secrets/`
- PostgreSQL reads from secret files
- No secrets in environment variables
- Secure initialization process

</details>

<details>
<summary>🔒 Security Implementation</summary>

### Multi-Layer Security
- **File-based secrets**: Local file protection
- **Swarm encryption**: In-transit and at-rest encryption
- **Access control**: Service-level permissions
- **Audit trails**: Secret usage logging

### Best Practices Applied
```bash
# Secure file permissions
chmod 600 psql_*.txt

# Use external secrets in production
docker secret create psql_password_prod - < /dev/stdin

# Implement secret rotation
./rotate-secrets.sh postgres-stack

# Monitor secret access
docker service logs postgres-stack_db | grep secret
```

</details>

<details>
<summary>📊 Monitoring & Troubleshooting</summary>

### Health Checks
```bash
# Verify secret mounting
docker exec $(docker ps -q -f name=postgres-stack_db) \
  ls -la /run/secrets/

# Test database connectivity
docker exec $(docker ps -q -f name=postgres-stack_db) \
  pg_isready -U $(cat psql_user.txt)

# Check secret usage in logs
docker service logs postgres-stack_db --since 1h
```

### Common Issues
- Secret file permissions
- Service placement constraints
- Network connectivity
- Secret rotation timing

</details>

<details>
<summary>🎯 Production Readiness</summary>

### Enterprise Features
- Integration with HashiCorp Vault
- Kubernetes secrets compatibility
- CI/CD pipeline integration
- Compliance and auditing

### Scaling Considerations
- Secret distribution performance
- High availability requirements
- Disaster recovery procedures
- Multi-region deployments

</details>