# Product Requirements Document — ElectroMatch AI

## Vision
ElectroMatch AI helps Indian consumers find the right electronic device in minutes, not hours. We replace endless spec-sheet comparison and biased YouTube reviews with a personalized AI advisor that understands intent.

## Target Users
- **Students** — budget laptops/phones for college
- **Professionals** — productivity, battery, build quality
- **Gamers** — GPU, refresh rate, thermals
- **Developers** — RAM, Linux compatibility, keyboard
- **Content Creators** — display color accuracy, camera, storage
- **General Consumers** — price/value sweet spot

## Core User Journeys
1. **Guided discovery** — Wizard: category → budget → usage → preferences → ranked AI recommendations with explanations.
2. **Natural-language search** — "lightweight laptop under ₹80k for AI/ML" → structured query → results.
3. **Compare-and-decide** — Pick up to 4 → side-by-side specs + AI verdict (winner per dimension).
4. **Save & track** — Wishlist + price alerts via email.
5. **Conversational refinement** — Chat assistant maintains context across turns.

## Success Metrics
- D1 retention > 25%
- Wizard completion > 60%
- Avg. recommendations viewed → wishlist conversion > 15%
- Chat assistant CSAT > 4.2/5

## V1 Scope (this codebase)
Landing, Wizard, NLP intake, Hybrid recommender, Results, Detail, Compare (≤4), AI summary, Chat, Wishlist, Search (ES), Dashboard, Price alerts, Reviews, Personalized recs, Trending, Admin panel scaffold.

## Out of Scope (V2+)
Affiliate checkout, native mobile, used-device marketplace, multi-region pricing, video reviews summarizer.

## Non-Functional
- p95 API < 400ms (cached), < 1500ms (AI)
- 99.9% uptime
- GDPR/DPDP compliant (India)
- WCAG 2.1 AA
