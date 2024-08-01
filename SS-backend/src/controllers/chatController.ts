// controllers/chatController.ts
import { Request, Response } from "express";
import { Chat } from "../models/chatModel";

export const createChatMessage = async (req: Request, res: Response) => {
  const { senderId, senderRole, recipientId, recipientRole, message } = req.body;
  try {
    const chatMessage = await Chat.create({
      senderId,
      senderRole,
      recipientId,
      recipientRole,
      message,
      timestamp: new Date(),
    });
    res.status(201).json(chatMessage);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  // const { senderId, recipientId } = req.query;
  try {
    const chatMessages = await Chat.findAll({
     
    });
    res.status(200).json(chatMessages);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
// where: {
//   senderId,
//   recipientId,
// },
// order: [["timestamp", "ASC"]],