# Deployment Guide

This project deploys locally as four services:

- React/Vite frontend
- Spring Boot API
- MySQL database
- Optional Flask ML prediction service

## Local Docker Smoke Test

```bash
docker compose up --build
```

Expected local URLs:

- Frontend: `http://localhost:15173`
- Backend health: `http://localhost:18080/actuator/health`
- ML health: `http://localhost:5000/health`
- MySQL inside Docker network: `mysql:3306`

The frontend Docker image serves React routes with an Nginx fallback, so direct visits to `/admin` and `/student` work after login.

The Docker frontend build uses `VITE_USE_MOCK=false` by default. Local Compose builds it against `http://localhost:18080`. If you deploy the frontend image somewhere other than local Docker Compose, pass the public backend URL as `VITE_API_BASE_URL` at image build time.

## Render Blueprint

The repo includes `render.yaml` for a free Render Blueprint:

- React/Vite static site
- Spring Boot Docker web service on the free plan
- Render Postgres database on the free plan

Create the Blueprint from the repository, then set these values when prompted:

- `APP_CORS_ALLOWED_ORIGINS`: deployed frontend URL, for example `https://student-performance-frontend.onrender.com`
- `VITE_API_BASE_URL`: deployed backend URL, for example `https://student-performance-backend.onrender.com`

Keep `VITE_USE_MOCK=false` in production so the frontend uses the Spring Boot API.

Render free Postgres databases expire after 30 days. For longer-lived demo data, upgrade the database or switch the `DATABASE_URL` environment variable to another Postgres provider.

## Optional ML Service

The backend works without Flask because it has a local prediction fallback.

To use the Flask service in production, deploy it separately and set:

- `FLASK_PREDICTION_ENABLED=true`
- `FLASK_PREDICTION_URL=<your Flask prediction URL>/predict`

## First Login

Seeded demo accounts:

- Admin: `admin / admin123`
- Teacher: `teacher / teacher123`
- Student: `student1 / student123`

Change these credentials after first deploy for any non-demo environment.
