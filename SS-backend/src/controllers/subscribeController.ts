import { Request, Response } from "express";
import { Subscribe } from "../models/subscribeModel";
import { Exam } from "../models/examModel";
import { Student } from "../models/studentModel";
import { Reservation } from "../models/reservationModel";
import { date } from "joi";
import sendEmail from "../utils/sendEmail";

export const createSubscribe = async (req: Request, res: Response) => {
  try {
    const subscribe = await Subscribe.create(req.body);
    const newsubscribe = await Subscribe.findOne({
      where: { subscribe__id: subscribe.subscribe__id },
      include: [{ model: Exam }, { model: Student }], // Include associated models
    });
    res.status(201).json(newsubscribe);
  } catch (error) {
    console.error("Error creating subscribe", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllSubscribes = async (req: Request, res: Response) => {
  try {

    console.log("tesetteset is tesetteset: ");

    const Allsubscribes = await Subscribe.findAll({});

    const datenow = new Date(); // Capitalize Date

    for (const subscrib of Allsubscribes) {
      const exam = await Reservation.findOne({
        where: { exam__id: subscrib.exam__id },
      });

      if (!exam || (exam && exam.startDate < datenow)) {
        await Subscribe.destroy({
          where: { subscribe__id: subscrib.subscribe__id },
        });
      }
    }
    console.log("Allsubscribes is : ", Allsubscribes);
    const subscribes = await Subscribe.findAll({
      include: [{ model: Exam }, { model: Student }],
    });

    console.log("ssaubscribes is : ", subscribes);

    res.status(200).json(subscribes);
  } catch (error) {
    console.error("Error fetch subscribe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateSubscribe = async (req: Request, res: Response) => {
  const { subscribe__id } = req.params;
  const updateData = {
    acceptation: req.body.accept,
  };
  console.log("updatedata", updateData);
  try {
    // Check if the Subscribe exists
    const subscribe = await Subscribe.findOne({ where: { subscribe__id } });

    if (!subscribe) {
      return res.status(404).json({ error: "Subscribe not found" });
    }

    // Update the Subscribe with new data
    await Subscribe.update(updateData, { where: { subscribe__id } });

    // Fetch the updated Subscribe with associated models
    const updatedSubscribe = await Subscribe.findOne({
      where: { subscribe__id },
      include: [{ model: Exam }, { model: Student }],
    });
    if (updatedSubscribe) {
      let stat='';
      console.log("helo subscribed hhhh ",updatedSubscribe.acceptation)
      console.log("helo subscribed hhhh ",updatedSubscribe.acceptation)
      switch (updatedSubscribe.acceptation) {
        case true:
          stat= "accepted";
          break;
        case false:
          stat= "refused";
          break;
        case null:
          stat= "in stay wait";
          break;
        default:
          return res.status(400).json({ message: "Invalid status" });
      }
      console.log("helo status hhhh ",stat)
     
      let text = `
      <div>
        <h1> Your request for ${updatedSubscribe.exams.exam__title} is ${stat}. </h1>
        
     
        <p>Thank you for choosing us.</p>
        <p>Best regards,</p>
      </div>`;
      await sendEmail(updatedSubscribe.student.user__email, "Subscribe Certificate", text);
    }

    res.status(200).json(updatedSubscribe);
  } catch (error) {
    console.error("Error updating subscribe:", error);
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


export const getSubscribeExam = async (req: Request, res: Response) => {

try{
  const {id} =  req.params
  const subscribes = await Subscribe.findAll({
    where:{exam__id : id, acceptation:true},
    include: [ { model: Student }],
  });
  res.status(200).json(subscribes);
} catch (error) {
  console.error("Error fetch subscribe", error);
  res.status(500).json({ error: "Internal server error" });
}

}
