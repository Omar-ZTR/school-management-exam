import { Request, Response } from "express";
import { Teacher } from "../models/teacherModel";
import { Subject } from "../models/subjectModel";
import { Group } from "../models/groupModel";
import { Question } from "../models/questionModel";
import { FileQuestion } from "../models/fileModel";
import { Reponse } from "../models/reponseModel";
import sendEmail from "../utils/sendEmail";
import { Exam } from "../models/examModel";
import { Student } from "../models/studentModel";
import uploadFileMiddleware from "../utils/upload";

export const getAllTeacher = async (req: Request, res: Response) => {
  try {
    const Teachers = await Teacher.findAll({
      include: [
        {
          model: Subject,
          as: "subjects",
        },
        {
          model: Group,
          as: "groups",
        },
      ],
      where: {
        emailVerifed: true,
      },
    });
    console.log("teachers is : ", Teachers);
    res.status(200).json(Teachers);
  } catch (error) {
    console.error("Error fetch Teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherData = req.body;

    const teacherExist = await Teacher.findByPk(id);

    if (!teacherExist) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    console.log("teacherData.subjects", teacherData.subjects);

    if (
      teacherData.groups &&
      Array.isArray(teacherData.groups) &&
      teacherData.groups.length > 0
    ) {
      const groups = await Group.findAll({
        where: {
          group__id: teacherData.groups,
        },
      });

      await teacherExist.$set("groups", groups);
    } else {
     
      await teacherExist.$set("groups", []);
    }
    if (
      teacherData.subjects &&
      Array.isArray(teacherData.subjects) &&
      teacherData.subjects.length > 0
    ) {
      const subjects = await Subject.findAll({
        where: {
          subject__id: teacherData.subjects,
        },
      });

      await teacherExist.$set("subjects", subjects);
    } else {
      
      await teacherExist.$set("subjects", []);
    }

    if (teacherExist.active !== teacherData.active) {
      const [updated] = await Teacher.update(teacherData, {
        where: { user__id: id },
      });

      if (updated) {
        const updatedTeacher = await Teacher.findOne({
          
          where: { user__id: id },
        });

        if (updatedTeacher) {
          let status;
          switch (updatedTeacher.active) {
            case true:
              status: "accepted";
              break;
            case false:
              status: "refused";
              break;
            case null:
              status: "in stay wait";
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
          await sendEmail(updatedTeacher.user__email, "Account Activation", text);
        }




        return res.status(200).json(updatedTeacher);
      } else {
        throw new Error("Teacher not updated");
      }
    } 
    return res.status(200).json(teacherExist);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).send("Error updating teacher");
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Teacher.destroy({ where: { user__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Teacher not found");
    }
  } catch (error) {
    console.error("Error deleting Teacher", error);
    res.status(500).send("Error deleting Teacher");
  }
};

export const TeacherByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findAll({
      where: { user__id: id },
      include: [
        {
          model: Subject,
          as: "subjects",
        },
        {
          model: Group,
          as: "groups",
          include:[
            {
              model: Student,
            },
          ]
        },
        {
          model: Exam,
          as: "exam",
        },
        {
          model: Question,
          as: "questions",
          include: [FileQuestion,Reponse],
        },
      ],
    });

    res.status(200).send(teacher);
  } catch (error) {
    console.error("Error Fetching Teacher", error);
    res.status(500).send("Error Fetching Teacher");
  }
};


const baseUrl = "http://localhost:3000/files/";

export const updatePProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await uploadFileMiddleware(req, res); 

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files:", req.files);

      const file = (req.files as Express.Multer.File[])[0];
      const img__path = baseUrl + file.filename;
      console.log("file attribute:", file);

     
      await Teacher.update({ img__path }, {
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