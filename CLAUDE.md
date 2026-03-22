# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# x-balance-ui

Frontend dashboard for the **x-balance** backend service — a user balance management system.
The UI provides full control over users, balances, and transaction history via the backend REST API.

**Always load both skills before any implementation task:**
- `frontend-vue` — architectural standard (FSD, Vue 3, Pinia, Vue Query, Biome)
- `frontend-design` — UI standard (Tailwind v4, shadcn/ui, OKLCH tokens)

---

## Backend

REST API + Swagger spec: `http://localhost:50051`
Swagger JSON: `http://localhost:50051/swagger.json`

API hooks are generated via **Orval** from the swagger spec into `src/shared/api/generated/`.
To regenerate: `bun orval` (requires the backend to be running).

---

## Business Rules (frontend must enforce)

- **All amounts are decimal strings** — never use `number` for money. Display as-is. Use `decimal.js` only if arithmetic is needed.
- **All balance mutations require a `transaction_id`** — always generate via `crypto.randomUUID()` on the client immediately before each operation. Never reuse IDs.
- **Freeze timeout** (`freeze_timeout_seconds`) — `0` means no timeout. Show as an optional field.
- **Unfreeze** requires the original freeze `transaction_id` — let the user pick from `FREEZE_HOLD` transactions in the list.
- **Soft-delete**: filter out users with `deleted_at != null` by default; provide a toggle to show deleted users.
- **Overdraft**: backend enforces the limit — frontend should display `overdraft_limit` prominently per user.

---

## Development Workflow

Follow the `Development Workflow` in the `frontend-vue` skill (Stage 1 → 2 → 3 → 4).

**Pre-commit:** `bun check && bun type-check && bun test:run`

---

## Validation Gates

Before each commit:
1. `bun check` — Biome lint + format
2. `bun type-check` — vue-tsc --noEmit
3. `bun test:run` — vitest
