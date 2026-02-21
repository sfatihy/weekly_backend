# Feature: BaseResponse and BaseErrorResponse Standardization

## 📌 Context
Currently, the API endpoints return data in a variety of non-standardized formats. For example:
- A task list returns an array: `[{}, {}]`
- Post endpoints return a generic JSON: `{ "success": true }` or `{ "message": "created" }`
- Errors return: `{ "error": "Error message" }`

As the project grows, clients (like the Flutter App) need a predictable structure in every HTTP response to easily parse data, display consistent error dialogs, and map JSON without writing custom serializers for each endpoint.

## 🎯 Goal
Implement a generic JSON response envelope across the entire backend. All successful requests will return a `BaseResponse<T>`, and all failed requests will return a `BaseErrorResponse`. 

## 🛠 Proposed Solution

### 1. `BaseResponse<T>`
A successful API call (2xx HTTP Status) should ALWAYS return this structure:
```json
{
  "success": true,
  "data": { ... } // or []
}
```
**TypeScript Interface Example:**
```typescript
export interface BaseResponse<T> {
  success: true;
  data: T;
  message?: string; // Optional message, e.g., "Registration successful"
}
```

### 2. `BaseErrorResponse`
A failed API call (4xx or 5xx HTTP Status) should ALWAYS return this structure:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED", // or "UNAUTHORIZED", "INTERNAL_SERVER_ERROR"
    "message": "User email is required"
  }
}
```
**TypeScript Interface Example:**
```typescript
export interface BaseErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any; // For array of validation errors, etc.
  }
}
```

### 3. Hono Middleware / Helper Pattern
To enforce this pattern across all routes without duplicating `{ success: true, data: ... }` everywhere, we will create a utility helper or a Hono middleware to automatically format all `c.json()` calls.

## 📈 Required Route Modifications
Once implemented, every `c.json()` return throughout `auth.ts`, `goals.ts`, `notes.ts`, `tasks.ts`, and `transactions.ts` must be updated to conform to these new BaseResponse types. Correspondingly, `src/openapi.ts` and `FLUTTER_AI_GUIDE.md` must be updated to reflect wrapped API responses.

## 📅 Status
**Planned** - This feature is currently in the backlog and will be implemented in a future phase to uniformize API communication.
