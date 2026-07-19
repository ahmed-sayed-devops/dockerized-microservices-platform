<p align="center">
  <img src="Architecture.png" width="100%">
</p>

<h1 align="center">
🚀 Dockerized Microservices Platform
</h1>

<p align="center">

A production-inspired Dockerized Microservices Platform demonstrating **High Availability**, **Reverse Proxy Load Balancing**, **Monitoring**, **Metrics Collection**, and **Observability** using Docker, Nginx, Prometheus, Grafana, cAdvisor, and MySQL Exporter.

</p>

<p align="center">

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

</p>

---

# 📖 Overview

This project demonstrates how to build a production-inspired multi-container web platform using **Docker Compose**.

The application consists of multiple isolated services communicating through dedicated Docker networks while providing monitoring, observability, high availability, and fault tolerance.

The platform includes:

- ⚛️ React Frontend
- 🚀 Node.js + Express Backend APIs
- 🗄️ MySQL Database
- 🌐 Nginx Reverse Proxy & Load Balancer
- 📊 Prometheus
- 📈 Grafana
- 🐳 cAdvisor
- 🗄️ MySQL Exporter

---

# 📑 Table of Contents

- Overview
- Architecture
- Technology Stack
- Project Structure
- Features
- Docker Services
- Networks & Volumes
- Deployment
- Monitoring Stack
- Dashboards
- High Availability
- Restart Policies
- Load Testing
- Future Improvements
- Author

---

# 🏗️ Architecture

```text
                        Users
                          │
                          ▼
                 ┌─────────────────┐
                 │      Nginx      │
                 │ Reverse Proxy   │
                 └────────┬────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        Backend Instance 1      Backend Instance 2
              │                       │
              └───────────┬───────────┘
                          ▼
                       MySQL Database
                          ▲
                          │
                  MySQL Exporter
                          ▲
                          │
                    Prometheus
                     ▲      ▲
                     │      │
              cAdvisor   App Metrics
                     │
                     ▼
                  Grafana
```

<p align="center">
<img src="Architecture.png" width="95%">
</p>

---

# ⚙️ Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | MySQL 8 |
| Reverse Proxy | Nginx |
| Monitoring | Prometheus |
| Visualization | Grafana |
| Container Metrics | cAdvisor |
| Database Metrics | MySQL Exporter |
| Containers | Docker |
| Orchestration | Docker Compose |

---

# 📁 Project Structure

```text
docker-platform/
│
├── backend/
├── frontend/
├── database/
├── nginx/
├── monitoring/
│   ├── prometheus/
│   └── grafana/
│
├── screenshots/
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── Architecture.png
├── README.md
└── .gitignore
```

---

# ✨ Features

- ✅ Dockerized Multi-Service Architecture
- ✅ Docker Compose Deployment
- ✅ Isolated Docker Networks
- ✅ Persistent MySQL Storage
- ✅ Reverse Proxy using Nginx
- ✅ High Availability using Multiple Backend Containers
- ✅ Health Checks
- ✅ Resource Limits (CPU & Memory)
- ✅ Restart Policies
- ✅ Logging Configuration
- ✅ Prometheus Monitoring
- ✅ Grafana Dashboards
- ✅ cAdvisor Container Monitoring
- ✅ MySQL Exporter
- ✅ Load Testing
- ✅ Production Docker Configuration

---

# 🐳 Docker Services

| Service | Purpose |
|----------|----------|
| frontend | React Application |
| backend1 | Express REST API |
| backend2 | Express REST API |
| mysql | Database Server |
| nginx | Reverse Proxy & Load Balancer |
| prometheus | Metrics Collection |
| grafana | Metrics Visualization |
| cadvisor | Container Monitoring |
| mysql-exporter | MySQL Metrics Exporter |

---

# 🌐 Docker Networks

The project uses three isolated Docker networks.

| Network | Purpose |
|----------|----------|
| frontend-net | Frontend ↔ Nginx |
| backend-net | Backend ↔ MySQL |
| monitoring-net | Monitoring Components |

---

# 💾 Persistent Volumes

Persistent Docker volumes ensure data survives container recreation.

- MySQL Database
- Grafana Data

<p align="center">
<img src="screenshots/21-docker-networks-volumes.png" width="95%">
</p>

---

# 🚀 Running the Project

Clone the repository

```bash
git clone https://github.com/ahmed-sayed-devops/dockerized-microservices-platform.git

cd dockerized-microservices-platform
```

Build and start the platform

```bash
docker compose \
-f docker-compose.yml \
-f docker-compose.prod.yml up -d
```

Verify running containers

```bash
docker ps
```

Stop the platform

```bash
docker compose down
```

---

# 🚀 Deployment Process

## Build Images

<p align="center">
<img src="screenshots/22-docker-images.png" width="95%">
</p>

---

## Start Docker Compose

<p align="center">
<img src="screenshots/02-Compose-Up.png" width="95%">
</p>

---

## Running Containers

All containers are healthy and operational.

<p align="center">
<img src="screenshots/03-Running-Containers.png" width="95%">
</p>

---

## Browser Test

The application is successfully served through Nginx.

<p align="center">
<img src="screenshots/07-browser-test.png" width="95%">
</p>

---

# 📊 Monitoring Stack

The monitoring stack consists of:

- Prometheus
- Grafana
- cAdvisor
- MySQL Exporter
- Custom Backend Metrics

## Prometheus Targets

<p align="center">
<img src="screenshots/08-Prom-Targets.png" width="95%">
</p>

All monitoring targets are successfully discovered and scraped.

Prometheus collects metrics from:

- Backend APIs
- cAdvisor
- MySQL Exporter

Access Prometheus:

```text
http://localhost:9090
```

---

## Grafana

Grafana visualizes all collected metrics using custom dashboards.

Access:

```text
http://localhost:3000
```

Default credentials:

```text
Username: admin
Password: admin
```

---

# 📈 Monitoring Dashboards


## 📊 Application Dashboard

A custom Grafana dashboard was created to monitor the backend application's performance in real time.

Metrics include:

- Total HTTP Requests
- Requests Per Second (RPS)
- Average Response Time
- Request Duration
- HTTP Status Codes

<p align="center">
<img src="screenshots/12-application-dashboard.png" width="95%">
</p>

---

## 🐳 Container Dashboard (cAdvisor)

Container metrics are collected using **cAdvisor** and visualized through Grafana.

The dashboard displays:

- CPU Usage
- Memory Usage
- Network Traffic
- Filesystem Usage
- Running Containers
- Container Health

<p align="center">
<img src="screenshots/13-cadvisor-dashboard.png" width="95%">
</p>

---

## 🗄️ MySQL Dashboard

Database metrics are exported using **mysqld-exporter** and collected by Prometheus.

The dashboard provides:

- Active Connections
- Queries Per Second
- InnoDB Buffer Pool
- Thread Cache
- Temporary Objects
- Open Tables
- Open Files
- Slow Queries

<p align="center">
<img src="screenshots/16-mysql-dashboard-1.png" width="95%">
</p>

---

# ❤️ Health Checks

Health checks were configured to ensure services are available before dependent containers start.

| Service | Health Check |
|----------|--------------|
| MySQL | mysqladmin ping |
| Backend | `/health` endpoint |
| Prometheus | `/-/healthy` |
| Grafana | `/api/health` |
| cAdvisor | `/metrics` |

This prevents dependent services from starting before their dependencies become healthy.

---

# 🔄 Restart Policies

Different restart policies were applied according to each service's responsibility.

| Service | Restart Policy |
|----------|----------------|
| Nginx | always |
| Backend | unless-stopped |
| MySQL | unless-stopped |
| Prometheus | unless-stopped |
| Grafana | unless-stopped |
| cAdvisor | unless-stopped |

### Restart Policy Validation

A container was manually terminated using:

```bash
docker kill <container-name>
```

Docker restarted the container automatically according to its configured restart policy.

<p align="center">
<img src="screenshots/04-Test-RestartPolicy-By-docker-kill.png" width="95%">
</p>

---

The **unless-stopped** policy was also verified by manually stopping a container.

<p align="center">
<img src="screenshots/05-Test-RestartPolicy-Unless-stopped.png" width="95%">
</p>

---

# ⚙️ Resource Limits

CPU and memory limits were configured for all production containers using `docker-compose.prod.yml`.

Resource usage was verified with:

```bash
docker stats
```

<p align="center">
<img src="screenshots/06-docker-stats.png" width="95%">
</p>

---

# ⚡ High Availability Demonstration

The application uses **two backend instances** behind an **Nginx Reverse Proxy**.

To verify failover behavior, one backend instance was intentionally stopped.

```bash
docker stop docker-platform-backend1-1
```

---

## Backend Instance Stopped

<p align="center">
<img src="screenshots/09-Stop-Target.png" width="95%">
</p>

---

## Prometheus Detects Failure

Prometheus immediately reported the backend instance as **DOWN**.

<p align="center">
<img src="screenshots/10-Prom-Target-Down.png" width="95%">
</p>

---

## Application Remained Available

Despite the backend failure, users continued accessing the application successfully because Nginx automatically redirected requests to the healthy backend instance.

<p align="center">
<img src="screenshots/11-high-availability-test.png" width="95%">
</p>

---

# 🚀 Load Testing

Traffic was generated to validate monitoring dashboards and load balancing behavior.

```bash
for i in {1..500}; do
    curl http://localhost/api/products > /dev/null
done
```

Load generation:

<p align="center">
<img src="screenshots/19-load-test.png" width="95%">
</p>

---

Grafana immediately reflected the increased traffic.

<p align="center">
<img src="screenshots/20-Dashboard-Track.png" width="95%">
</p>

---

# 📊 Metrics Collected

## Application Metrics

- HTTP Requests
- Requests Per Second
- Request Duration
- Average Response Time
- HTTP Status Codes

---

## Docker Metrics

- CPU Usage
- Memory Usage
- Network Usage
- Filesystem Usage
- Running Containers
- Container Health

---

## Database Metrics

- Current Connections
- Queries Per Second
- InnoDB Buffer Pool
- Thread Cache
- Temporary Objects
- Open Tables
- Open Files
- Slow Queries

---

# 🎥 Project Demonstration

A complete walkthrough of the project, including deployment, monitoring, load balancing, high availability testing, restart policies, and dashboards, is available in the demonstration video.

🎬 Demo Video:
https://drive.google.com/file/d/1sYiCjS8-7I7rrcHRiHXJULAs30SkHlPZ/view?usp=drivesdk

---

# 📌 Future Improvements

- Kubernetes Deployment
- Horizontal Pod Autoscaling
- Jenkins CI/CD Pipeline
- GitHub Actions CI/CD
- HTTPS with Let's Encrypt
- Loki Log Aggregation
- ELK Stack Integration
- Prometheus Alertmanager
- Docker Swarm Deployment

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Ahmed Sayed**

DevOps & Cloud Engineer

- GitHub: https://github.com/ahmed-sayed-devops
- LinkedIn: https://www.linkedin.com/in/ahmed-sayed-devops

---

<p align="center">

### ⭐ If you found this project helpful, consider giving it a Star!

</p>