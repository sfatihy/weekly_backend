# Project Turtle - Flutter AI Integration Guide

Hello AI! You are acting as the Frontend (Flutter) Developer for **Project Turtle**.
This document describes the Backend (Cloudflare Workers + Hono + D1) Architecture and how you should format your Flutter Code to consume this REST API.

## 🔗 Backend URL Info
- **Production Base URL:** `https://weekly_backend.seyitfatihyazici11.workers.dev`
- **Swagger Documentation:** `https://weekly_backend.seyitfatihyazici11.workers.dev/ui`
- **Format:** `application/json`

## 🔐 Authentication (JWT)
The system uses JWT (JSON Web Tokens). You **must** implement the following logic in Flutter:
1. Interceptors (`dio` or `http` adapter) should attach the `Authorization: Bearer <accessToken>` header to **all** private API calls.
2. If a `401 Unauthorized` arrives, intercept it and call `POST /auth/refresh` with the `refreshToken`.
3. If successful, save new tokens (e.g., in `flutter_secure_storage`) and retry the original request.
4. If refresh fails, log the user out and redirect to the Login Screen.

### Authentication Endpoints (PUBLIC)
- `POST /auth/register`
  - Body: `{"email": "user@mail.com", "password": "123", "name": "User"}`
  - Response (201): `accessToken` and `refreshToken`

- `POST /auth/login`
  - Body: `{"email": "user@mail.com", "password": "123"}`
  - Response (200): `accessToken` and `refreshToken`

- `POST /auth/refresh`
  - Body: `{"refreshToken": "<saved_token>"}`
  - Response (200): `accessToken`

## 📂 Protected Endpoints (Requires Bearer Token)

### 1. Users (`/users`)
- `GET /users/{id}`: Fetch User by ID.

### 2. Goals (`/goals`)
- `POST /goals`: Create a new Goal (`id`, `title`, `targetHours`, `period`).
- `GET /goals`: Fetch all Goals.
- `POST /goals/{goalId}/logs`: Add progress (`id`, `hours`, `timestamp` as ISO8601 string, `isCompleted` boolean).
- `GET /goals/{goalId}/logs`: View progress for a specific goal.

### 3. Tasks (`/tasks`)
- `POST /tasks`: Create task (`id`, `title`, `description`, `startTime`, `endTime`, `status`, `recurrence`, `goalId`, `goalLogId`). *Note: Time formats should be ISO8601.*
- `GET /tasks`: Fetch tasks for the current user.
- `PUT /tasks/{id}/status`: Update task status. Body: `{"status": "Completed"}`.

### 4. Notes (`/notes`)
- `POST /notes`: Create note (`id`, `title`, `content`).
- `GET /notes`: Fetch user notes.

### 5. Transactions (`/transactions`) (Finance)
- `POST /transactions`: Basic income/expense. (`id`, `title`, `amount`, `type`, `date`, `category`).
- `GET /transactions`: View transactions.

## 🛠 Required Flutter Packages (AI Developer Notice)
When building the client, you are highly encouraged to use:
- `dio` or standard `http` package for API Calls.
- `flutter_secure_storage` for securely saving JWT tokens on iOS/Android.
- A robust state management (e.g., `riverpod` or `bloc`) to manage the Authentication state seamlessly.

*(End of Context. Use this information to generate Repositories, API Clients, and Models accurately).*
