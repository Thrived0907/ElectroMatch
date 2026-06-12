# REST API Reference

Base: `https://api.electromatch.ai/v1`
Auth: `Authorization: Bearer <clerk_jwt>`

## Products
- `GET  /products?category=&minPrice=&maxPrice=&brand=&page=`
- `GET  /products/:id`
- `GET  /products/:id/similar`
- `GET  /products/:id/price-history`

## Recommendations
- `POST /recommend` — body: `{ category, budget, usage, preferences[] }`
- `POST /recommend/nlp` — body: `{ query: "lightweight laptop under 80k for AI" }`
- `GET  /recommend/history`

## Comparison
- `POST /compare` — body: `{ productIds: [..max 4..] }` → specs grid + AI summary

## Chat
- `POST /chat/threads` → `{ threadId }`
- `POST /chat/threads/:id/messages` → streams SSE
- `GET  /chat/threads`

## Wishlist
- `GET    /wishlist`
- `POST   /wishlist` `{ productId }`
- `DELETE /wishlist/:productId`

## Reviews
- `GET  /products/:id/reviews`
- `POST /reviews` `{ productId, rating, body }`

## Price Alerts
- `POST   /alerts` `{ productId, threshold }`
- `GET    /alerts`
- `DELETE /alerts/:id`

## Search
- `GET /search?q=&filters=...`

## Dashboard
- `GET /dashboard` — aggregated user data

## Admin (role=ADMIN)
- `GET /admin/stats`
- `CRUD /admin/products`
- `CRUD /admin/categories`
- `POST /admin/reviews/:id/moderate`
