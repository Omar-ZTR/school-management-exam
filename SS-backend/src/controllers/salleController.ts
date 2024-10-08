import { Op } from "sequelize";
import { Reservation } from "../models/reservationModel";
import { Salle } from "../models/salleModel"; // Import your Salle model
import { Request, Response } from "express";

// Create 
export const createSalle = async (req: Request, res: Response) => {
  try {
    const salle = await Salle.create(req.body);
    const newSalle = await Salle.findOne({
      where: { salle__id: salle.salle__id },
    });
    res.status(201).json(newSalle);
  } catch (error) {
    console.error("Error creation salle", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get all salles
export const getAllSalles = async (req: Request, res: Response) => {
  try {
    const salles = await Salle.findAll();
    res.status(200).json(salles);
  } catch (error) {
    console.error("Error fetch salle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSallesSpecific = async (req: Request, res: Response) => {
  try {
    const { starthour, endhour,reserv__id } = req.body;
   
    console.log("start", starthour, "end", endhour, "id is ",reserv__id);
    
    if (!starthour || !endhour) {
      return res.status(400).json({ error: "Hours are required" });
    }
    
    const start = new Date(starthour);
    const end = new Date(endhour);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

   
    const durationMs = end.getTime() - start.getTime();
    
    
    const reservations = await Reservation.findAll({
      where: {
        [Op.or]: [
          {
            startDate: {
              [Op.lt]: new Date(start.getTime() + durationMs),
            },
            endDate: {
              [Op.gte]: end,
            },
            reserv__id: {
              [Op.ne]: reserv__id,
            },
          },
          {
            endDate: {
              [Op.and]: [
                {
                  [Op.lte]: new Date(start.getTime() + durationMs),
                },
                { [Op.gt]: start },
              ],
            },
            startDate: {
              [Op.lte]: start,
            },
            reserv__id: {
              [Op.ne]: reserv__id,
            },
          },
          {
            endDate: {
              [Op.gt]: end,
            },
            startDate: {
              [Op.lt]: start,
            },
            reserv__id: {
              [Op.ne]: reserv__id,
            },
          },
          {
            endDate: {
              [Op.lte]: end,
            },
            startDate: {
              [Op.gte]: start,
            },
            reserv__id: {
              [Op.ne]: reserv__id,
            },
          },
        ],
      },
      attributes: ["salle"],
    });
  

    console.log("Reservations:", reservations);

    let salles: any[] = [];

    if (reservations.length > 0) {
      const salleNames = reservations.map(reservation => reservation.salle);
      salles = await Salle.findAll({
        where: {
          salle__id: {
            [Op.notIn]: salleNames,
          },
        },
      });
    } else {
      salles = await Salle.findAll();
    }

    console.log("Available Salles:", salles);
    res.status(200).json(salles);

  } catch (error) {
    console.error("Error fetching available salles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


   // const examreservations = await Reservation.findAll({
    //   where: {
    //     [Op.and]: [
    //       {
    //         startDate: {
    //           [Op.eq]: start,
    //         },
          
    //         reserv__id: {
    //           [Op.eq]: nb,
    //         },
    //       },
          
    //     ],
    //   },
    //   attributes: ["salle , group__name"],
    // });

    // console.log("exaaaa ress", examreservations);
    // let availableSalles: any[];

    // if (reservations.length === 0) {
    //   // If there are no reservations, return all salles
    //   if (nb !== undefined) {
    //     availableSalles = await Salle.findAll({
    //       where: {
    //         nb__place: {
    //           [Op.gte]: nb,
    //         },
    //       },
    //     });
    //   } else {
    //     availableSalles = await Salle.findAll();
    //   }
    // } else {
    //   // If there are reservations, find salles not in the reserved list
    //   const reservedSalles = reservations.map(
    //     (reservation) => reservation.salle
    //   );

    //   if (nb !== undefined) {
    //     availableSalles = await Salle.findAll({
    //       where: {
    //         salle__name: {
    //           [Op.notIn]: reservedSalles,
    //         },
    //         nb__place: {
    //           [Op.gte]: nb,
    //         },
    //       },
    //     });
    //   } else {
    //     availableSalles = await Salle.findAll({
    //       where: {
    //         salle__name: {
    //           [Op.notIn]: reservedSalles,
    //         },
    //       },
    //     });
    //   }
    // }









// Read operation - Get salle by ID
export const getSalleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const salle = await Salle.findByPk(id);
    if (salle) {
      res.status(200).json(salle);
    } else {
      res.status(404).json({ message: "Salle not found" });
    }
  } catch (error) {
    console.error("Error fetch salle", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update 
export const updateSalle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Salle.update(req.body, {
      where: { salle__id: id },
    });
    if (updated) {
      const updatedSalle = await Salle.findOne({ where: { salle__id: id } });
      
      res.status(200).json(updatedSalle);
    } else {
      throw new Error("Salle not found");
    }
  } catch (error) {
    console.error("Error updating salle", error);
    res.status(500).send("Error updating salle");
  }
};


export const CheckSalles = async (req: Request, res: Response) => {
  try {
    const { id }= req.params
    const currentDate = new Date();
  let SchudExam = 0
        const scheduls = await Reservation.findOne( {where: { salle: id, endDate: { [Op.gt]: currentDate } },});
        if(scheduls){
          console.log("mn", scheduls)
          SchudExam = SchudExam + 1
        }
     
const Count  = SchudExam
console.log("Count is Count",Count)
console.log("SchudExam is SchudExam",SchudExam)
       res.status(200).json(Count);
    
   
  } catch (error) {
    console.error("Error fetching subjects", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete 
export const deleteSalle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Salle.destroy({ where: { salle__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Salle not found");
    }
  } catch (error) {
    console.error("Error deleting salle", error);
    res.status(500).send("Error deleting salle");
  }
};
