import { Router } from "express";
import { createChatMessage, getChatMessages } from "./chatController";

const routerChat = Router();

routerChat.post("/chats", createChatMessage);
routerChat.get("/chats", getChatMessages);

export default routerChat;