import { z } from "zod";

export const CategoryEnum = z.enum([
  "LAPTOP","SMARTPHONE","TABLET","SMARTWATCH","HEADPHONES",
  "MONITOR","KEYBOARD","MOUSE","OTHER"
]);
export type Category = z.infer<typeof CategoryEnum>;

export const RecommendInput = z.object({
  category: CategoryEnum,
  budgetMin: z.number().int().min(0),
  budgetMax: z.number().int().min(0),
  usage: z.array(z.string()).min(1),
  preferences: z.array(z.string()).default([]),
});
export type RecommendInput = z.infer<typeof RecommendInput>;

export const NlpRecommendInput = z.object({
  query: z.string().min(5).max(500),
});

export const CompareInput = z.object({
  productIds: z.array(z.string().cuid()).min(2).max(4),
});

export const WishlistInput = z.object({
  productId: z.string().cuid(),
});

export const ReviewInput = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(10).max(2000),
});

export const PriceAlertInput = z.object({
  productId: z.string().cuid(),
  threshold: z.number().int().positive(),
});

export const ChatMessageInput = z.object({
  threadId: z.string().cuid().optional(),
  content: z.string().min(1).max(2000),
});
