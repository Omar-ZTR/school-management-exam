import { Request, Response } from "express";
import { Student } from "../models/studentModel";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import sendEmail from "../utils/sendEmail";
import uploadFileMiddleware from "../utils/upload";
import { Group } from "../models/groupModel";

export const getAllStudents = async (req: Request, res: Response) => {
  try {


    const student = await Student.findAll({
      where: {
        emailVerifed: true, 
      },
      order: [
        ['createdAt', 'DESC'] 
      ]
    });
    console.log("studens is : ", student);
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetch student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getstudentbyidGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const students = await Student.findAll({
      where: {
       group__id:  id 
      },
    });
    console.log("studens is : ", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetch student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getstudentbyid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const students = await Student.findOne({
      where: {
        emailVerifed: true, user__id: id 
      },
    });
    console.log("studens is : ", students);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetch student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const getMonthlyStudentCount = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const monthNames: { [key: number]: string } = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };
    const studentCounts = await Student.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("user__id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
    });
    const formattedCounts = studentCounts.map((item: any) => ({
      month: monthNames[item.getDataValue("month")],
      count: item.getDataValue("count"),
    }));

    res.status(200).json(formattedCounts);
  } catch (error) {
    console.error("Error fetching monthly student count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChartStudentCount = async (req: Request, res: Response) => {
  try {
    const { firstDate, endDate } = req.body;

    const monthNames: { [key: number]: string } = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    const studentCounts = await Student.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("user__id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [firstDate, endDate],
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
    });

    const formattedCounts = studentCounts.map((item: any) => ({
      month: monthNames[item.getDataValue("month")],
      count: item.getDataValue("count"),
    }));

    res.status(200).json(formattedCounts);
  } catch (error) {
    console.error("Error fetching monthly student count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDaysStudentCount = async (req: Request, res: Response) => {
  try {
    const { firstDate, endDate } = req.body;

    const startDate = new Date(firstDate);
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1); 

    const monthNames: { [key: number]: string } = {
      0: "janvier",
      1: "février",
      2: "mars",
      3: "avril",
      4: "mai",
      5: "juin",
      6: "juillet",
      7: "août",
      8: "septembre",
      9: "octobre",
      10: "novembre",
      11: "décembre",
    };

    const studentCounts = await Student.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("user__id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDateObj],
        },
      },
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
    });

    const formattedCounts = studentCounts.map((item: any) => ({
      date: item.getDataValue("date"),
      count: item.getDataValue("count"),
    }));

    res.status(200).json(formattedCounts);
  } catch (error) {
    console.error("Error fetching monthly student count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const baseUrl = "http://localhost:3000/files/";

export const updatePictureProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await uploadFileMiddleware(req, res); 

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files:", req.files);

      const file = (req.files as Express.Multer.File[])[0];
      const img__path = baseUrl + file.filename;
      console.log("file attribute:", file);

      
      await Student.update({ img__path }, {
        where: { user__id: id },
      });

      res.status(200).send({ message: 'Profile picture updated successfully.' });
    } else {
      res.status(400).send({ message: 'No files were uploaded.' });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).send({ message: 'Error updating profile picture.' });
  }
};




export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Student.destroy({ where: { user__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Student not found");
    }
  } catch (error) {
    console.error("Error deleting Student", error);
    res.status(500).send("Error deleting Student");
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Student.update(req.body, {
      where: { user__id: id },
    });

    if (updated) {
      const updatedStudent = await Student.findOne({ where: { user__id: id } });
      if (updatedStudent) {
        let status;
        switch (updatedStudent.active) {
          case true:
            status= "accepted";
            break;
          case false:
            status= "refused";
            break;
          case null:
            status= "in stay wait";
            break;
          default:
            return res.status(400).json({ message: "Invalid status" });
        }

        const url = `http://localhost:4200/dash`;
        let text = `
        <div>
          <h1>Account Activation</h1>
          <h2>We are delighted to welcome you to our platform!</h2>
          <p>Your account status is ${status}.</p>`;
        
        if (status === "accepted") {
          text += `
          <p>To log in, please click below:</p>
          <a href="${url}" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
          ">Confirm Your Email</a>`;
        }
        
        text += `
          <p>Thank you for choosing us.</p>
          <p>Best regards,</p>
        </div>`;
        await sendEmail(updatedStudent.user__email, "Account Activation", text);
      }

      res.status(200).json(updatedStudent);
    } else {
      throw new Error("Student not found");
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const deleteStudentGr = async (req: Request, res: Response) => {
  try {
    const deleteData = req.body.model;
console.log("syysysysysyysysyysys", deleteData)
    if (!Array.isArray(deleteData.IDS) || deleteData.IDS.length === 0) {
      return res.status(400).send("No students provided for deletion");
    }

    let deletionCount = 0;
    for (const stud of deleteData.IDS) {
      const deleted = await Student.destroy({ where: { user__id: stud } });
      deletionCount += deleted; 
    }

    if (deletionCount > 0) {
      res.status(204).send(); 
    } else {
      res.status(404).send("No students found to delete");
    }
  } catch (error) {
    console.error("Error deleting Student", error);
    res.status(500).send("Error deleting Student");
  }
};



export const updateStudentgroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Student.update(req.body, {
      where: { user__id: id },
    });

    if (updated) {
      const updatedStudent = await Student.findOne({ where: { user__id: id } });
      const group = await Group.findOne({ where: { group__id: updatedStudent?.group__id } });
      if (updatedStudent) {
      

        const url = `http://localhost:4200/dash`;
        let text = `
        <div>
          <h1>Update Group</h1>
          <h2>We are update your group</h2>
          <p>Your new group is:</p>
          <h2>  ${updatedStudent.group?.group__name}</h2>`;
        
  
        
      
        await sendEmail(updatedStudent.user__email, "Account Activation", text);
      }

      res.status(200).json(updatedStudent);
    } else {
      throw new Error("Student not found");
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
