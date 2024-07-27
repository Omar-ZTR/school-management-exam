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
exports.getOneSubscribe = exports.getAllSubscribes = exports.createSubscribe = void 0;
const subscribeModel_1 = require("../models/subscribeModel");
const examModel_1 = require("../models/examModel");
const studentModel_1 = require("../models/studentModel");
const createSubscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribe = yield subscribeModel_1.Subscribe.create(req.body);
        const newsubscribe = yield subscribeModel_1.Subscribe.findOne({
            where: { subscribe__id: subscribe.subscribe__id },
            include: [{ model: examModel_1.Exam }, { model: studentModel_1.Student }], // Include associated models
        });
        res.status(201).json(newsubscribe);
    }
    catch (error) {
        console.error('Error creating subscribe', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createSubscribe = createSubscribe;
const getAllSubscribes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribes = yield subscribeModel_1.Subscribe.findAll({
            include: [{ model: examModel_1.Exam }, { model: studentModel_1.Student }],
        });
        res.status(200).json(subscribes);
    }
    catch (error) {
        console.error("Error fetch subscribe:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllSubscribes = getAllSubscribes;
const getOneSubscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exam__id, user__id } = req.params;
        const subscribe = yield subscribeModel_1.Subscribe.findOne({
            where: { exam__id, user__id },
            // include: [{ model: Exam }, { model: Student }], // Include associated models
        });
        if (subscribe) {
            res.status(200).json(subscribe);
        }
        else {
            res.status(404).json({ message: "Subscribe not found" });
        }
    }
    catch (error) {
        console.error("Error fetch subscribe", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getOneSubscribe = getOneSubscribe;
