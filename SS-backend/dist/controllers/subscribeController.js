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
exports.getOneSubscribe = exports.updateSubscribe = exports.getAllSubscribes = exports.createSubscribe = void 0;
const subscribeModel_1 = require("../models/subscribeModel");
const examModel_1 = require("../models/examModel");
const studentModel_1 = require("../models/studentModel");
const reservationModel_1 = require("../models/reservationModel");
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
        const Allsubscribes = yield subscribeModel_1.Subscribe.findAll({});
        const datenow = new Date(); // Capitalize Date
        for (const subscrib of Allsubscribes) {
            const exam = yield reservationModel_1.Reservation.findOne({
                where: { exam__id: subscrib.exam__id },
            });
            if (!exam || (exam && exam.startDate < datenow)) {
                yield subscribeModel_1.Subscribe.destroy({
                    where: { subscribe__id: subscrib.subscribe__id },
                });
            }
        }
        console.log("Allsubscribes is : ", Allsubscribes);
        const subscribes = yield subscribeModel_1.Subscribe.findAll({
            include: [{ model: examModel_1.Exam }, { model: studentModel_1.Student }],
        });
        console.log("ssaubscribes is : ", subscribes);
        res.status(200).json(subscribes);
    }
    catch (error) {
        console.error("Error fetch subscribe:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllSubscribes = getAllSubscribes;
const updateSubscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscribe__id } = req.params;
    const updateData = {
        acceptation: req.body.accept
    };
    console.log("updatedata", updateData);
    try {
        // Check if the Subscribe exists
        const subscribe = yield subscribeModel_1.Subscribe.findOne({ where: { subscribe__id } });
        if (!subscribe) {
            return res.status(404).json({ error: 'Subscribe not found' });
        }
        // Update the Subscribe with new data
        yield subscribeModel_1.Subscribe.update(updateData, { where: { subscribe__id } });
        // Fetch the updated Subscribe with associated models
        const updatedSubscribe = yield subscribeModel_1.Subscribe.findOne({
            where: { subscribe__id },
            include: [{ model: examModel_1.Exam }, { model: studentModel_1.Student }],
        });
        res.status(200).json(updatedSubscribe);
    }
    catch (error) {
        console.error('Error updating subscribe:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateSubscribe = updateSubscribe;
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
