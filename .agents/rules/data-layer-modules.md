# Data Layer Module Conventions

This rule establishes the architectural responsibilities and naming conventions for data access and domain data transfer files across the application.

## Core Module Responsibilities

When structuring data modeling, access control, and persistence operations, organize code into the following designated files:

| File | Primary Responsibility | Scope & Typical Contents |
| :--- | :--- | :--- |
| `definitions.ts` | **Types, contracts, and schemas** | TypeScript `type` and `interface` definitions, data contracts, and schema validation objects (e.g., Zod schemas) that represent domain models or data shapes. |
| `dto.ts` | **Select and structure transferred data** | Data Transfer Object (DTO) transformers, mappers, and projection functions that sanitize, shape, or format data crossing system or client/server boundaries. |
| `dal.ts` | **Protected data access** | Data Access Layer (DAL) ensuring authorization, permission verification, context validation, and boundary protection before delegating to queries or mutations. |
| `data.ts` | **Data queries and operations** | Low-level queries, persistence interactions, database/SDK operations, and mutation logic. |
| `auth.ts` | **User authentication** | Authentication operations and credential verification ("Who are you?"), user sign-up, sign-in, credential validation, password recovery, and sign-out. |
| `session.ts` | **Session lifecycle & state** | Session management ("Are you authenticated and what is your active session?"), token signing/verification, session storage/cookies, and session persistence. |

## Architectural Guidelines

1. **Separation of Concerns**:
   - `dal.ts` acts as the security and authorization boundary. Direct client or route calls must pass through the DAL rather than calling `data.ts` directly when sensitive or protected access is involved.
   - `data.ts` focuses strictly on query execution or storage mechanisms without mixing in routing, UI logic, or presentation-level concerns.
   - `dto.ts` ensures internal persistence schemas are not leaked directly to untrusted contexts, projecting and stripping sensitive or internal fields.
   - `definitions.ts` serves as the contract and single source of truth for shapes and validation rules, consumed by `dto.ts`, `dal.ts`, and `data.ts`.
   - `auth.ts` encapsulates authentication operations (login, registration, password recovery, sign-out) to answer user identity challenges.
   - `session.ts` governs session state, expiration, tokens, and cookie persistence, decoupled from specific credential checks or presentation forms.

2. **Locality and Placement**:
   - For domain-wide or shared features, place modules under `src/lib/<domain>/` (e.g., `src/lib/user/dal.ts`, `src/lib/user/dto.ts`).
   - For route-private or feature-colocated data access, place modules in private folders (e.g., `_lib/`).
