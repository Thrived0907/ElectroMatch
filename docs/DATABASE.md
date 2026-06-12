# Database Design

All in PostgreSQL via Prisma. See `apps/api/prisma/schema.prisma` for the full schema.

## Core Entities
- **User** (synced from Clerk via webhook)
- **Category**, **Brand**, **Product**, **Specification** (key/value, indexed)
- **Recommendation** — persists each AI run for re-display + analytics
- **Wishlist**, **Review**, **Comparison**, **PriceAlert**, **PriceHistory**
- **ChatThread**, **ChatMessage**
- **SearchHistory**, **ProductView** (personalization signals)
- **AnalyticsEvent** (admin dashboard)

## Indexes
- `Product(categoryId, price)` — wizard filter
- `Specification(productId, key)` — spec lookups
- `PriceHistory(productId, recordedAt DESC)` — chart queries
- GIN on `Product.searchVector` (Postgres FTS fallback)

## Constraints
- `Wishlist (userId, productId) UNIQUE`
- `Review (userId, productId) UNIQUE`
- `PriceAlert.threshold > 0`
