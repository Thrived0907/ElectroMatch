import { openai, MODEL } from "../config/openai";
import { prisma } from "../config/prisma";

const SYSTEM = `You are ElectroMatch AI, a friendly electronics shopping assistant for India.
Help users pick laptops, phones, tablets, etc. Ask clarifying questions if needed.
When recommending, mention 2-3 specific products with brand + model + approx INR price and why.
Be concise. Use markdown bullets.`;

export const chatService = {
  async createThread(userId: string) {
    return prisma.chatThread.create({ data: { userId } });
  },
  async listThreads(userId: string) {
    return prisma.chatThread.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },
  async getMessages(threadId: string, userId: string) {
    const t = await prisma.chatThread.findFirst({ where: { id: threadId, userId } });
    if (!t) throw Object.assign(new Error("Thread not found"), { status: 404 });
    return prisma.chatMessage.findMany({ where: { threadId }, orderBy: { createdAt: "asc" } });
  },
  async send(threadId: string, userId: string, content: string) {
    const t = await prisma.chatThread.findFirst({ where: { id: threadId, userId } });
    if (!t) throw Object.assign(new Error("Thread not found"), { status: 404 });

    await prisma.chatMessage.create({ data: { threadId, role: "user", content } });
    const history = await prisma.chatMessage.findMany({ where: { threadId }, orderBy: { createdAt: "asc" } });

    const resp = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM }, ...history.map(m => ({ role: m.role as "user"|"assistant", content: m.content }))],
    });
    const reply = resp.choices[0]?.message?.content ?? "Sorry, I couldn't answer.";
    const saved = await prisma.chatMessage.create({ data: { threadId, role: "assistant", content: reply } });
    return saved;
  },
};
