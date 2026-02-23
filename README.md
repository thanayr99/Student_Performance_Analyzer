# Advanced Student Performance Analytics & Predictive Reporting System

Full-stack role-based system for student analytics, risk prediction, and recommendations.

## Stack

- Backend: Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL, Swagger, Lombok
- Frontend: React (Vite), React Router, Axios, Context API
- Optional ML: Flask + scikit-learn (`/predict`)
- Deployment: Docker + Docker Compose

## Project Structure

```text
backend/      Spring Boot API
frontend/     React app
ml-service/   Optional Flask prediction service
database/     SQL schema + sample data
```

## Core Features

- JWT authentication (`/auth/register`, `/auth/login`)
- Role-based authorization
  - `/admin/**` for `ROLE_ADMIN`
  - `/student/**` for `ROLE_STUDENT`
- Student analytics:
  - credit-weighted GPA
  - subject-wise averages
  - attendance impact
  - trend slope from last 3 exams
  - risk level (LOW/MEDIUM/HIGH)
  - improvement index (current semester GPA - previous semester GPA)
  - recommendations
- Admin analytics:
  - total students
  - class average GPA
  - high-risk count
  - subject difficulty index
  - top 5 performers
  - CSV export of risk report

## Backend Setup

1. Create MySQL DB (or let app auto-create):
   - DB name: `student_performance`
2. Configure env vars (or use defaults in `backend/src/main/resources/application.yml`):
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `FLASK_PREDICTION_ENABLED` (`true` or `false`)
   - `FLASK_PREDICTION_URL`
3. Start backend:

```bash
cd backend
mvn spring-boot:run
```

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Optional ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

Then set backend env:
- `FLASK_PREDICTION_ENABLED=true`
- `FLASK_PREDICTION_URL=http://localhost:5000/predict`

## Docker Compose

```bash
docker compose up --build
```

Services:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- ML API: `http://localhost:5000`
- MySQL: `localhost:3306`

## Demo Credentials

- Admin: `admin / admin123`
- Student: `student1 / student123`

These are seeded by `backend/src/main/java/com/student/analytics/config/DataInitializer.java`.

## Key API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Admin
- `GET /admin/students`
- `GET /admin/analytics`
- `GET /admin/risk-report`
- `GET /admin/risk-report/export`
- `POST /admin/marks`
- `POST /admin/attendance`

### Student
- `GET /student/profile`
- `GET /student/marks`
- `GET /student/analytics`

## Database Artifacts

- Schema SQL: `database/schema.sql`
- Sample SQL: `database/sample_data.sql`

## Notes

- Passwords are BCrypt encrypted.
- JWT includes role claim and username.
- Global exception handling and request validation are enabled.
- `DataInitializer` seeds data if database is empty.
