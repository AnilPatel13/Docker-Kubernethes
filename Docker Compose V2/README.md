# Docker Compose V2

This directory contains advanced Docker Compose examples and assignments demonstrating multi-container applications and orchestration patterns.

## Overview

Docker Compose V2 introduces improved syntax, better performance, and enhanced features for container orchestration. This section covers practical examples of multi-service applications using the latest Docker Compose specifications.

## Directory Structure

### Assignment Examples
- **compose-assignment-1/**: Drupal CMS with PostgreSQL database
- **compose-assignment-2/**: Custom application with database integration

### Sample Applications
- **compose-sample-2/**: Nginx proxy with Apache web server
- **compose-sample-3/**: Static website with Nginx proxy and Apache backend

## Key Features Demonstrated

### Multi-Service Applications
- Web applications with database backends
- Reverse proxy configurations
- Service networking and communication

### Volume Management
- Named volumes for data persistence
- Bind mounts for development workflows
- Volume cleanup and management

### Network Configuration
- Service discovery and internal networking
- Port mapping and exposure
- Load balancing with reverse proxies

## Examples Covered

### 1. Drupal with PostgreSQL (compose-assignment-1)
```yaml
services:
  drupal:
    image: drupal:9
    ports:
      - "8080:80"
    volumes:
      - drupal-modules:/var/www/html/modules
      - drupal-profiles:/var/www/html/profiles
      - drupal-sites:/var/www/html/sites
      - drupal-themes:/var/www/html/themes
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_PASSWORD=mypasswd
```

### 2. Nginx Proxy with Apache (compose-sample-2)
```yaml
services:
  proxy:
    image: nginx:1.23
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
  web:
    image: httpd:latest
```

## Common Commands

### Basic Operations
```bash
# Start services in detached mode
docker-compose up -d

# View running services
docker-compose ps

# View service logs
docker-compose logs

# Stop and remove containers
docker-compose down

# Stop and remove containers with volumes
docker-compose down -v
```

### Service Management
```bash
# Scale services
docker-compose up -d --scale web=3

# Restart specific service
docker-compose restart web

# View service processes
docker-compose top
```

### Volume Operations
```bash
# List volumes
docker volume ls

# Remove unused volumes
docker volume prune

# Remove specific volumes
docker volume rm volume_name
```

## Best Practices

### Configuration
- Use environment variables for sensitive data
- Implement proper volume strategies for data persistence
- Configure appropriate restart policies
- Use specific image tags instead of 'latest'

### Security
- Avoid exposing unnecessary ports
- Use secrets management for sensitive information
- Implement proper network segmentation
- Regular security updates for base images

### Performance
- Optimize image sizes
- Use multi-stage builds when appropriate
- Configure resource limits
- Monitor container performance

## Troubleshooting

### Common Issues
- Port conflicts: Change host port mappings
- Volume permissions: Check file ownership and permissions
- Network connectivity: Verify service names and networking
- Resource constraints: Monitor CPU and memory usage

### Debugging Commands
```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs -f service_name

# Execute commands in running containers
docker-compose exec service_name bash

# Validate compose file
docker-compose config
```

## Learning Objectives

By working through these examples, you will learn:
- Multi-container application orchestration
- Service networking and communication
- Volume management and data persistence
- Reverse proxy configuration
- Database integration patterns
- Container lifecycle management
- Troubleshooting multi-service applications

## Next Steps

1. Experiment with different service combinations
2. Implement custom networking configurations
3. Add monitoring and logging solutions
4. Explore production deployment strategies
5. Learn about Docker Swarm and Kubernetes migration paths