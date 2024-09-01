"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("./chatController");
const routerChat = (0, express_1.Router)();
routerChat.post("/chats", chatController_1.createChatMessage);
routerChat.get("/chats", chatController_1.getChatMessages);
exports.default = routerChat;
