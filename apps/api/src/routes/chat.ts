import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { ChatMessageInput } from "@electromatch/shared";
import { chatService } from "../services/chatService";

const r = Router();
r.use(requireAuth);

r.get("/threads", async (req, res, next) => {
  try { res.json({ items: await chatService.listThreads((req as any).user.id) }); } catch (e) { next(e); }
});
r.post("/threads", async (req, res, next) => {
  try { res.json(await chatService.createThread((req as any).user.id)); } catch (e) { next(e); }
});
r.get("/threads/:id/messages", async (req, res, next) => {
  try { res.json({ items: await chatService.getMessages(req.params.id, (req as any).user.id) }); } catch (e) { next(e); }
});
r.post("/threads/:id/messages", async (req, res, next) => {
  try {
    const { content } = ChatMessageInput.parse(req.body);
    res.json(await chatService.send(req.params.id, (req as any).user.id, content));
  } catch (e) { next(e); }
});

export default r;
