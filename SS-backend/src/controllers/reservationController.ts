import { Op } from "sequelize";
import { Reservation } from "../models/reservationModel"; // Import your Reservation model
import { Request, Response } from "express";
import { Exam } from "../models/examModel";
import { Group } from "../models/groupModel";
import { Salle } from "../models/salleModel";
import { Student } from "../models/studentModel";
import sendEmail from "../utils/sendEmail";
import { format } from 'date-fns';
// Create operation
export const createReservation = async (req: Request, res: Response) => {
  try {
    console.log("bbbbbbbb", req.body);
    const code = generateCode();

    // Create the reservation object with the generated code
    const reservationData = {
      ...req.body,
      code: code,
    };

    const reservation = await Reservation.create(reservationData);
    const updatedReservation = await Reservation.findOne({
        where: { reserv__id: reservation.reserv__id },
        include: [
          {
            model: Exam,
          },
        ],
      });

      if (updatedReservation) {
        await notifyExamReservation(updatedReservation);
      }


    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creation reservation", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateCode = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const getSpecificReservations = async (req: Request, res: Response) => {
  const { groupid } = req.params;
  console.log("groupName", req.params);

  const group = await Group.findByPk(groupid);

  console.log("groupgroup group group", group);
  try {
    const currentDate = new Date();

    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { group__name: { [Op.eq]: group!.group__name } },
              { group__name: { [Op.is]: null } },
            ],
          },
          {
            startDate: { [Op.gt]: currentDate },
          },
        ],
      },
    });

    const formattedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        const exam = await Exam.findByPk(reservation.exam__id);
        return {
          reserv__id: reservation.reserv__id,
          exam__id: reservation.exam__id,
          salle: reservation.salle,
          group__name: reservation.group__name,
          title: reservation.exam__title,
          desc: exam?.exam__desc,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          code: reservation.code,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
          obligation: exam ? exam.obligatoire : null,
        };
      })
    );

    res.status(200).json(formattedReservations);
  } catch (error) {
    console.error("Error fetch reservations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Read operation - Get all reservations
export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetch reservations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Read operation - Get reservation by ID
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    console.error("Error fetch reservation", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update operation
export const updateReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Reservation.update(req.body, {
      where: { reserv__id: id },
    });
    if (updated) {
        const updatedReservation = await Reservation.findOne({
            where: { reserv__id: id },
            include: [
              {
                model: Exam,
              },
            ],
          });
    
          if (updatedReservation) {
            await notifyExamReservation(updatedReservation);
          }
    
          res.status(200).json(updatedReservation);
    } else {
      throw new Error("Reservation not found");
    }
  } catch (error) {
    console.error("Error deleting reservation", error);
    res.status(500).send("Error deleting reservation");
  }
};

// Delete operation
export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.destroy({ where: { reserv__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Reservation not found");
    }
  } catch (error) {
    console.error("Error deleting reservation", error);
    res.status(500).send("Error deleting reservation");
  }
};


export const notifyExamReservation = async (updatedReservation: any) => {
    const salle = await Salle.findOne({
      where: { salle__id: updatedReservation.salle },
    });
    
    let group = null;
    if (updatedReservation.group__name) {
      group = await Group.findOne({
        where: { group__name: updatedReservation.group__name },
        include: [
          {
            model: Student,
          },
        ],
      });
    }
  
  const formattedDate = format(new Date(updatedReservation.startDate), "d MMMM yyyy 'at' HH:mm");

  let text = `
    <div>
      <h1>Exam Notification</h1>
      <p>You have an exam titled "${updatedReservation.exam.exam__title}" scheduled on ${formattedDate}`;

  if (salle) {
    text += ` in salle "${salle.salle__name}"`;
  }

  if (group) {
    text += ` with the group "${group.group__name}."`;
  } else {
    text += `. This exam is a certificate exam.`;
  }

  text += `</p>
      <p>Thank you for choosing us.</p>
      <p>Best regards,</p>
     
    </div>`;
  
    if (group?.students) {
      for (const student of group.students) {
        await sendEmail(student.user__email, "Exam Notification", text);
      }
    }
  };