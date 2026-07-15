# Master Project Plan: Modern E-Commerce Platform

## 1. Project Overview
This project is a modern, high-performance e-commerce platform designed to handle diverse product catalogs. The system consists of a robust Admin Dashboard for inventory and order management, and a premium Customer Storefront. The architecture prioritizes ultimate performance (0ms perceived load times), strict code cleanliness, and a highly polished, professional localized Arabic UI.

## 2. Tech Stack & Architecture
- **Framework:** Next.js (App Router)
- **Database ORM:** Prisma
- **Styling:** Tailwind CSS (Using consistent, premium custom utility classes like `.luxury-card`, `.input-luxury`)
- **Icons:** `lucide-react` ONLY (Google Material is strictly forbidden)
- **Validation:** Zod
- **Architecture Pattern:** Hybrid Server/Client Split.
    - Server Components handle database fetching and pass sanitized data.
    - Client Components handle interactivity, filtering, and UI state.
    - **Streaming:** Heavy use of `<Suspense>` boundaries with customized Skeleton loaders.

## 3. Strict Global Rules (AI Directives)
- **Financial Accuracy:** All pricing fields (`price`, `sale_price`, `total`) must be `Decimal` in Prisma and properly serialized to `Number` before passing to the client.
- **English Numerals:** ALL rendered numbers (prices, stock, dates, pagination) MUST be displayed using standard English digits (1, 2, 3...) regardless of the Arabic UI text.
- **Serialization Safety:** Never pass raw Prisma `Decimal` or `Date` objects to Client Components. Convert to `Number` and `ISOString` respectively.
- **Security & Logging:** Strictly exclude and filter sensitive credentials (e.g., passwords, tokens) from all application logs and server-side console outputs to enhance system security.
- **UX/Tone:** The Arabic copywriting must be professional, clear, and user-friendly, ensuring a premium shopping experience suitable for any product category.

## 4. Development Roadmap & Milestones

### Phase 1: Foundation & Architecture (Completed)
- [x] Set up Next.js App Router and Prisma schema.
- [x] Define global Tailwind styling and modern UI components.
- [x] Establish the Hybrid Pattern (Server Fetchers + Client Views) with Suspense and Skeletons in `src/components/admin/`.

### Phase 2: Inventory & Product Management (Completed/Refining)
- [x] **Database:** Product model with `price`, `sale_price`, `stock`, `sku`.
- [x] **Validations:** Rule enforcing `sale_price` < `price`.
- [x] **Views:** Products listing with instant Search/Filter (Client-side) and real-time database fetching. Add/Edit/Delete flows.

### Phase 3: Categories Management (Next)
- [ ] **Database:** Category model (`id`, `name`, `slug`, `image`). Relation to Products.
- [ ] **Components:** `CategoryFetcher` and `CategorySkeleton`.
- [ ] **Views:** Admin page to create, edit, and delete categories, ensuring slugs are unique and generated correctly.

### Phase 4: Order Management System (OMS)
- [ ] **Database:** Order model (`orderNumber`, `total`, `status`, `customer details`).
- [ ] **Components:** `OrderFetcher` and `OrderSkeleton`.
- [ ] **Views:** Rich tabular display of recent orders, status update toggles (Pending, Processing, Shipped, Completed), and detailed single-order view.

### Phase 5: Members & Authentication
- [ ] **Database:** User model with role-based access (`ADMIN`, `CUSTOMER`).
- [ ] **Components:** `MemberFetcher` and `MemberSkeleton`.
- [ ] **Views:** Members list with role management, search by email/name, and secure credential handling.

### Phase 6: Customer Storefront (Future)
- [ ] Public-facing product catalog with optimized Image components.
- [ ] Shopping Cart and local state management.
- [ ] Secure Checkout flow and order placement.

## 5. Execution Protocol for AI
When assigned a task, refer to this `plan.md` to understand the current phase. Follow the architectural rules strictly. For complex modules, expect an additional specific `spec.md` file detailing the exact fields and route paths required.