---
name: backend
description: Backend development skill for the Prepiqo Node.js API. Use when changing Express 5 routes, controllers, middleware, MongoDB/Mongoose models, JWT auth, email OTP flows, Razorpay/IAP payments, LangChain services, rate limits, CORS, or backend package scripts under backend/.
---

# Prepiqo Backend

Use this skill for work in `backend/`. The backend is an ES Modules Node.js API using Express 5, MongoDB/Mongoose, JWT, bcryptjs, Nodemailer, Razorpay, Google auth, and LangChain services.

## First Checks

- Work from `backend/` for commands.
- Read `backend/package.json` before changing commands or dependencies.
- Run `npm run dev` for local development and `npm start` for production-style startup.
- Do not rely on `npm test`; it is currently a placeholder that exits with an error.
- Mount public API routes under `/api/v1` from `src/index.js`.
- Preserve current CORS origins unless the task is specifically about deployment or origins.

## Project Layout

- `src/index.js`: app creation, Mongo connection, JSON parsing, CORS, rate limiting, and route mounting.
- `src/config/`: database and external client configuration.
- `src/routes/`: Express routers only. Keep route files thin and delegate behavior to controllers.
- `src/controllers/`: request/response flow, validation, status codes, model/service calls.
- `src/middleware/`: auth, admin authorization, rate/request limits.
- `src/models/`: Mongoose schemas, instance methods, refs, indexes.
- `src/services/`: LLM, MCQ, notes, QA, chat, payment, and other business logic.
- `src/utils/`: shared helpers such as email sending.
- `src/seed*.js`: one-off seed scripts. Avoid touching unless data setup is the task.

## API Conventions

- Use ES module imports with explicit `.js` extensions for local backend modules.
- Prefer controller exports named by action, e.g. `loginUser`, `updateProfile`.
- Keep response shapes compatible with existing frontend expectations:
  - Auth success responses usually return user fields plus `token` at the top level.
  - Verification flows may return flags such as `requiresVerification`, `requiresOtp`, `email`, and `message`.
  - Errors usually return `{ message: "..." }`; do not introduce a global `{ success, data }` envelope unless updating all callers.
- Use appropriate HTTP status codes: `400` validation, `401` unauthenticated, `403` authenticated but forbidden or unverified, `404` missing resource, `500` unexpected server failure.
- Catch async controller errors and return JSON. If adding a new async wrapper, update routes consistently instead of mixing incompatible patterns.

## Auth And Security

- Use `protect` from `src/middleware/auth.middleware.js` for routes that require a logged-in user.
- Use `authorizeAdmin` only after `protect`.
- JWT payloads currently use `{ id }`; middleware loads `req.user` with `User.findById(decoded.id).select('-password')`.
- Never return password hashes, OTP hashes, reset tokens, or secrets.
- Hash passwords with `bcryptjs`.
- OTP and reset-token flows hash stored tokens with `crypto` and send only the raw short-lived token to the user.
- Avoid logging secrets, tokens, passwords, API keys, payment signatures, or complete third-party payloads.
- Prefer environment variables for secrets; do not add new fallback secrets for production-sensitive behavior.

## Mongoose Rules

- Export models consistently with the existing file style. Example: `export const User = mongoose.model('User', userSchema);`.
- Use `timestamps: true` for new persistent models unless there is a reason not to.
- Use refs for relationships already represented in the app, e.g. `currentSubscription` references `Subscription`.
- Add indexes for frequently queried fields and uniqueness constraints where product logic requires them.
- For dynamic query input, validate and sanitize IDs, enums, pagination, and filters before querying.
- Use `.select('-password')` or explicit projections when returning users or sensitive models.

## Payments And External Integrations

- Treat Razorpay, IAP, Google OAuth, Nodemailer, and LangChain code as boundary code: validate incoming payloads, check signatures/tokens where applicable, and keep provider-specific logic isolated in controllers/services/config.
- Preserve idempotency in payment/subscription updates where possible; payment callbacks may repeat.
- Keep email subject/body changes aligned with the product name currently used in the app unless rebranding is requested.

## Validation

- After backend edits, run the narrowest useful check:
  - Syntax/import sanity: `node src/index.js` only when it is acceptable to start the server.
  - Local dev server: `npm run dev`.
  - Endpoint verification with a running server when routes/controllers change.
- If a command cannot be run because required `.env` values, MongoDB, or external services are unavailable, state that clearly and still inspect for import/path mistakes.
