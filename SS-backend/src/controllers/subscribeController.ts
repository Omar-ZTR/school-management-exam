import { Request, Response } from "express";
import { Subscribe } from "../models/subscribeModel";
import { Exam } from "../models/examModel";
import { Student } from "../models/studentModel";

export const createSubscribe = async (req: Request, res: Response) => {
    try {
      const subscribe = await Subscribe.create(req.body);
      const newsubscribe = await Subscribe.findOne({
        where: { subscribe__id: subscribe.subscribe__id },
        include: [{ model: Exam }, { model: Student }], // Include associated models
      });
      res.status(201).json(newsubscribe);
    } catch (error) {
      console.error('Error creating subscribe', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const getAllSubscribes = async (req: Request, res: Response) => {
    try {
      const subscribes = await Subscribe.findAll({
        include:  [{ model: Exam }, { model: Student }],
      });
      res.status(200).json(subscribes);
    } catch (error) {
      console.error("Error fetch subscribe:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


  export const getOneSubscribe = async (req: Request, res: Response) => {
    try {
      const { exam__id, user__id } = req.params;
      const subscribe = await Subscribe.findOne({
        where: { exam__id, user__id },
        // include: [{ model: Exam }, { model: Student }], // Include associated models
      });
      if (subscribe) {
        res.status(200).json(subscribe);
      } else {
        res.status(404).json({ message: "Subscribe not found" });
      }
    } catch (error) {
      console.error("Error fetch subscribe", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };