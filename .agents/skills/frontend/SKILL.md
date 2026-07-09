---
name: frontend
description: Frontend development skill for the Prepiqo Next.js app. Use when changing frontend/ App Router pages, React components, Tailwind styles, Zustand auth state, Axios API calls, Google OAuth, Razorpay UI hooks, dashboard flows, landing sections, or Next 16/React 19 behavior.
---

# Prepiqo Frontend

Use this skill for work in `frontend/`. The frontend uses Next.js App Router, React, TypeScript, Tailwind CSS, Axios, Zustand, Google OAuth, and Razorpay integration.

## First Checks

- Read `frontend/AGENTS.md` before changing Next.js behavior. This project uses Next `16.2.9` and React `19.2.4`; if an API or convention is uncertain, check local docs under `frontend/node_modules/next/dist/docs/`.
- Work from `frontend/` for commands.
- Run `npm run lint` after code changes when feasible.
- Run `npm run build` for route, server/client boundary, or config changes when feasible.
- Use `npm run dev` to manually verify UI changes.

## Project Layout

- `app/`: App Router routes, layouts, global CSS, and app providers.
- `app/Providers.tsx`: client-side provider wrapper for Google OAuth.
- `app/dashboard/`: authenticated dashboard routes.
- `app/resetpassword/[token]/` and `app/share/[id]/`: dynamic routes.
- `components/`: shared components. Landing page sections live in `components/landing/`.
- `hooks/`: reusable client hooks, including Razorpay logic.
- `lib/axios.ts`: the shared API client.
- `store/authStore.ts`: Zustand auth state and auth actions.
- `public/`: static assets.

## Next And React Rules

- Add `'use client';` only to files that need browser APIs, hooks, event handlers, Zustand state, OAuth, Razorpay, or `localStorage`.
- Keep server components as server components where possible.
- Access `window`, `document`, and `localStorage` only inside client components/hooks or guarded blocks.
- Use App Router filenames and folders: `page.tsx`, `layout.tsx`, dynamic segments like `[token]`.
- Preserve metadata/layout behavior in `app/layout.tsx` unless the task explicitly changes global shell behavior.

## API And Auth

- Use `frontend/lib/axios.ts` for backend calls instead of creating new Axios instances.
- The API base URL comes from `NEXT_PUBLIC_API_URL`, with local fallback `http://localhost:5001/api/v1`.
- Auth token storage currently uses `localStorage` key `token`; user data uses `localStorage` key `user`.
- Use `useAuthStore` from `store/authStore.ts` for login, register, Google login, logout, profile updates, and auth state.
- Existing backend auth responses return user fields plus `token` at the top level. Match that shape when adding frontend flows.
- Handle backend verification flags such as `requiresVerification`, `requiresOtp`, `email`, and `message`.

## UI And Styling

- Use Tailwind utilities and existing component style patterns before adding custom CSS.
- Keep landing page work in `components/landing/` and dashboard work under `app/dashboard/` or shared components when reused.
- Design for responsive layouts. Check mobile widths for long labels, forms, pricing cards, and dashboard panels.
- Keep form states explicit: loading, success, error, disabled submit while pending, and backend error messages.
- Prefer accessible native controls and labels. Buttons that trigger async work should expose disabled/loading state.

## Integrations

- Google OAuth client ID comes from `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `app/Providers.tsx`.
- Razorpay UI behavior belongs in `hooks/useRazorpay.ts` or a focused component using that hook.
- Do not hardcode production API URLs, Google IDs, Razorpay keys, or secrets in source files.

## Validation

- For most edits, run `npm run lint`.
- For route, layout, Next config, provider, or server/client boundary changes, also run `npm run build`.
- For visible UI changes, start `npm run dev` and verify the affected route in a browser when possible.
- If build/lint cannot run because dependencies, environment, or the local Next version are unavailable, report the exact blocker and still check TypeScript imports and obvious client/server boundary issues.
