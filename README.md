# Collaborative Board

This project includes:
- 📦 **Backend** — Node.js with pnpm
- ⚛️ **Frontend** — React app inside the `client/` folder
- 🐳 **Docker Compose** — for easy local setup

---

## 📑 Requirements
- Node.js (>=18) and pnpm (if running locally)
- Docker & Docker Compose (if using containers)

---

## 🚀 Getting Started

### Run Locally

#### Backend
```bash
# install dependencies
pnpm install

# start the backend
pnpm start
````

#### Frontend

```bash
cd client

# install dependencies
pnpm install

# start the frontend
pnpm start
```

---

### Run with Docker Compose

```bash
docker-compose up --build
```

Frontend: [http://localhost:3000](http://localhost:3000)
Backend: [http://localhost:5000](http://localhost:5000)

Stop containers:

```bash
docker-compose down
```
