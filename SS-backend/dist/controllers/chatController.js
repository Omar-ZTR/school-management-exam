"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessages = exports.createChatMessage = void 0;
const chatModel_1 = require("../models/chatModel");
const createChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, senderRole, recipientId, recipientRole, message } = req.body;
    try {
        const chatMessage = yield chatModel_1.Chat.create({
            senderId,
            senderRole,
            recipientId,
            recipientRole,
            message,
            timestamp: new Date(),
        });
        res.status(201).json(chatMessage);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createChatMessage = createChatMessage;
const getChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { senderId, recipientId } = req.query;
    try {
        const chatMessages = yield chatModel_1.Chat.findAll({});
        res.status(200).json(chatMessages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getChatMessages = getChatMessages;
// where: {
//   senderId,
//   recipientId,
// },
// order: [["timestamp", "ASC"]],
