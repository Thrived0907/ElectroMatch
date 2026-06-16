import { groq, MODEL } from "../config/openai";
import { prisma } from "../config/prisma";

const SYSTEM = `
You are ElectroMatch AI, a friendly electronics shopping assistant for India.
Help users choose laptops, phones, tablets and gadgets.
Recommend products with approximate INR prices.
Use concise bullet points.
`;

export const chatService = {
  async createThread(userId: string) {
    return prisma.chatThread.create({
      data: { userId },
    });
  },

  async listThreads(userId: string) {
    return prisma.chatThread.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getMessages(threadId: string, userId: string) {
    const thread = await prisma.chatThread.findFirst({
      where: { id: threadId, userId },
    });

    if (!thread) {
      throw Object.assign(new Error("Thread not found"), {
        status: 404,
      });
    }

    return prisma.chatMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    });
  },

  async send(threadId: string, userId: string, content: string) {
    const thread = await prisma.chatThread.findFirst({
      where: { id: threadId, userId },
    });

    if (!thread) {
      throw Object.assign(new Error("Thread not found"), {
        status: 404,
      });
    }

    await prisma.chatMessage.create({
      data: {
        threadId,
        role: "user",
        content,
      },
    });

    const history = await prisma.chatMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    });

    const prompt = `
${SYSTEM}

Conversation:

${history
  .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
  .join("\n")}
`;

  const result = await groq.chat.completions.create({
  model: MODEL,
  messages: [
    {
      role: "system",
      content: SYSTEM,
    },
    {
      role: "user",
      content: prompt,
    },
  ],
});

const reply =
  result.choices[0]?.message?.content ??
  "Sorry, I couldn't answer.";

    const saved = await prisma.chatMessage.create({
      data: {
        threadId,
        role: "assistant",
        content: reply,
      },
    });

    return saved;
  },
};