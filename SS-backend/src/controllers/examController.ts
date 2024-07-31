import { Exam } from "../models/examModel"; // Import your Exam model
import { Request, Response } from "express";
import uploadFile from "../utils/upload";
import { Reponse } from "../models/reponseModel";
import { Question } from "../models/questionModel";
import { FileExam, FileQuestion } from "../models/fileModel";
import { Reservation } from "../models/reservationModel";
import { Group } from "../models/groupModel";
import { Student } from "../models/studentModel";
import { updateQuestionsWithExam } from "./questionController";
import uploadFileMiddleware from "../utils/upload";
import { Answer } from "../models/answerModel";
import { Op, Sequelize } from "sequelize";

const baseUrl = "http://localhost:3000/files/";
// Create operation

export const createExam = async (req: Request, res: Response) => {
  console.log("exam 1", req.body);
  try {
    console.log("exam 2", req.body.files);

    await uploadFileMiddleware(req, res); // Handle file upload

    const examDatas = { ...req.body }; // Assuming exam data is in req.body

    const examData = JSON.parse(examDatas.exam);
   
    const exam = await Exam.create(examData);


    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "content",
          exam__id: exam.exam__id,
        };
        console.log("file attribute", support__files);
        await FileExam.create(support__files);
      }
    }

    console.log("file 8");
    if (examData.questions && Array.isArray(examData.questions) && examData.questions.length > 0) {
     
     
      await updateQuestionsWithExam({
        body: {
          exam__id: exam.exam__id,
          questionIds: examData.questions.map((q: any) => q.question__id || q)
        }
      } as Request, res);
    }


    res.status(201).json(exam);
  } catch (error) {
    console.error("Error creation exam", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






// if (
//   examDatas.questions &&
//   Array.isArray(examDatas.questions) &&
//   examDatas.questions.length > 0
// ) {
//   console.log("if eloula fotnaha");
//   const questionsData = examDatas.questions;
//   for (const questionData of questionsData) {
//     questionData.exam__id = exam.exam__id;
//     const question = await Question.create(questionData);
//     console.log("question fotnaha");
//     // Create the responses for each question
//     if (
//       questionData.reponses &&
//       Array.isArray(questionData.reponses) &&
//       questionData.reponses.length > 0
//     ) {
//       console.log("if ethanya fotnaha");
//       const responsesData = questionData.reponses;
//       for (const responseData of responsesData) {
//         responseData.question__id = question.question__id;

//         await Reponse.create(responseData);
//       }
//     }
//   }
// }












// Get Exam by ID
export const getExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Requested gggggggggggExam ID:", id);

    const exam = await Exam.findOne({
      where: { exam__id: id },
      include: [
        {
          model: Question,
          include: [FileQuestion,Reponse],
        },
        {
          model: FileExam,
        }
        
      ],
    });

    if (exam) {
      console.log(exam);
      
      const examTaken =  formatExamData(exam)
      res.status(200).json(examTaken);
    } else {
      res.status(404).json({ message: "Exam not found" });
    }
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
function   formatExamData(exam: any): any {
  return {
    exam__id: exam.exam__id,
    subject: exam.subject,
    exam__title: exam.exam__title,
    exam__type: exam.exam__type,
    exam__desc: exam.exam__desc,
    obligatoire: exam.obligatoire,
    fileExam: exam.file.map((f: any) => ({
      file__id: f.file__id,
      file__name: f.file__name,
      file__path: f.file__path,
      file__type: f.file__type,
    })),
    questions: exam.questions.map((question: any) => ({
      question__id: question.question__id,
      question__text: question.question__text,
      question__type: question.question__type,
      note: question.note,
      fileQuestion: question.file.map((f: any) => ({
        file__id: f.file__id,
        file__name: f.file__name,
        file__path: f.file__path,
      })),
      reponses: question.reponses.map((reponse: any) => ({
        reponse__id: reponse.reponse__id,
        reponse__text: reponse.reponse__text,
        reponse__statut: reponse.reponse__statut
      }))
    }))
  };
}
// Get all exams
export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetch exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFullExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: Question },
        { model: Reservation },
        { model: FileExam },
      ],
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTeacherExams = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const exams = await Exam.findAll({
      include: [
        { model: Question },
        { model: Reservation },
        { model: FileExam },
        { model: Answer },
      ],
      where: { user__id: id },
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getExamsGroupsStutents = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const exams = await Exam.findAll({
      include: [
        {
          model: Group,
          include: [
            {
              model: Student,
             
            }
          ],
          through: { attributes: [] }
        }
      ],
      where: { user__id: id },
    });
    const result = await Promise.all(exams.map(async exam => {
      const groups = await Promise.all(exam.groups.map(async group => {
        const students = await Promise.all(group.students.map(async student => {
          const answer = await Answer.findOne({
            where: {
              Student__id: student.user__id,
              exam__id: exam.exam__id,
            }
          });
    
          return {
            exam:exam.exam__id,
            student__id:student.user__id,
            user__name: student.first__name + ' ' + student.last__name,
            ans__result: answer ? answer.ans__result : null,
            ans__id: answer ? answer.ans__id : null,
          };
        }));
        const res = await checkExam(group.group__name, exam.exam__id);
        if (res) {
          return {
            group__id: group.group__id,
          exam:exam.exam__id,
          group__name: group.group__name,  // Include group information if needed
          students: students,
            date: res.startDate
          };
        } else {
          return {
            group__id: group.group__id,
          exam:exam.exam__id,
          group__name: group.group__name,  // Include group information if needed
          students: students,
            date: ''
          };
        }
        // return {
        //   group__id: group.group__id,
        //   exam:exam.exam__id,
        //   group__name: group.group__name,  // Include group information if needed
        //   students: students
        // };
      }));
      let answers;
      let check;
      if (!exam.obligatoire) {
        answers = await Answer.findAll({
          where: {
            exam__id: exam.exam__id,
          }
        });
      
        answers = await Promise.all(answers.map(async ans => {
          const student = await Student.findOne({
            where: {
              user__id: ans.Student__id,
            }
          });
      
          // Add student__name to the answer object
          return {
            ...ans.get({ plain: true }), // Convert Sequelize model instance to plain object
            student__name: student ? `${student.first__name} ${student.last__name}` : null,
          };
        }));
         check = await Reservation.findAll({
          where: {
            exam__id: exam.exam__id,
          
          }
        });
 
      }





      
      return {
        exam__oblig:exam.obligatoire,
        exam__id:exam.exam__id,
        exam__name: exam.exam__title,  // Include exam information if needed
        groups: groups,
        answers:answers,
        date: check
      };
    }));
    // Filter answers by `exam__id`
    // exams.forEach(exam => {
    //   exam.groups.forEach(group => {
    //     group.students.forEach(student => {
    //       student.answers = student.answers.filter(answer => answer.exam__id === exam.exam__id);
    //     });
    //   });
    // });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching students for groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkExam = async (group: string, exam: number) => {
  try {
    const check = await Reservation.findOne({
      where: {
        exam__id: exam,
        group__name: group
      }
    });
    return check;
  } catch (error) {
    console.error('Error checking exam:', error);
    return null;
  }
};

export const addDescreptionExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;


    await uploadFileMiddleware(req, res); // Handle file upload

    const examDatas = { ...req.body }; // Assuming exam data is in req.body

    const examData = JSON.parse(examDatas.exam);

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "support",
          exam__id: id,
        };
        console.log("file attribute", support__files);
        await FileExam.create(support__files);
      }
    }
    const existExam = await Exam.findOne({ where: { exam__id: id } });
console.log("nmbvxczx",examData)
 if (existExam!.exam__desc === examData.exam__desc) {
    const [updated] = await Exam.update(examData, {
      where: { exam__id: id },
    });
   
      const updatedExam = await Exam.findOne({   include: [
        { model: Question },
        { model: Reservation },
        { model: FileExam },
        { model: Answer },
      ],where: { exam__id: id } });
      
      res.status(200).json(updatedExam);
    } else {
      const updatedExam = await Exam.findOne({   include: [
        { model: Question },
        { model: Reservation },
        { model: FileExam },
        { model: Answer },
      ],where: { exam__id: id } });
      
      res.status(200).json(updatedExam);
    }
  } catch (error) {
    console.error("Error updating Exam", error);
    res.status(500).send("Error updating Exam");
  }
};


// Update operation
export const updateExam = async (req: Request, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Params:", req.params);

    const { id } = req.params;
    const { operation } = req.body;
    const { group__id } = req.body;
    // Validate the operation
    if (typeof operation !== "number") {
      return res.status(400).send("Invalid operation value");
    }

    // Find the exam by primary key
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).send("Exam not found");
    }
    const group = await Group.findByPk(group__id);
    console.log("Existing Exam:", exam);
    if (group) {
     
      await exam.$add('groups', group);
    }

   

    
    // Update the nb__reserve field
    const nb__reserve = exam.nb__reserve + operation;
    const [updated] = await Exam.update(
      { nb__reserve },
      { where: { exam__id: id } }
    );

    if (updated) {
      const updatedExam = await Exam.findOne({ where: { exam__id: id } });
      res.status(200).json(updatedExam);
    } else {
      res.status(500).send("Failed to update exam");
    }
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).send("Error updating exam");
  }
};




export const updateExamFile = async (req: Request, res: Response) => {
  const {id} = req.params;
  console.log("id is ",id)
  try {
    console.log("exam 2", req.body.files);

    await uploadFileMiddleware(req, res); // Handle file upload
    console.log("exam 3", req.body.file);
   

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "content",
          exam__id: id, 
        };
        console.log("file attribute", support__files);
        await FileExam.create(support__files);
      }
    }

    
    

    const updatedExam = await Exam.findOne({ where: { exam__id: id } });
    res.status(200).json(updatedExam);
  } catch (error) {
    console.error("Error creation exam", error);
    res.status(500).json({ error: "Internal server error" });
  }

  
}

// Delete operation
export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Exam.destroy({ where: { exam__id: id } });
    if (deleted) {
      res.status(204).send("yes deleting exam");
    } else {
      throw new Error("Exam not found");
    }
  } catch (error) {
    console.error("Error deleting exam", error);
    res.status(500).send("Error deleting exam");
  }
};
// where: {
//   ans__result: {
//     [Op.ne]: null,
//   },
// },
// required: true,
export const getFilteredExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll({
      where: {
        obligatoire: false,
      },
      include: [
        {
          model: Answer,
         
         
        },
        {
          model: Reservation,
          as: 'reservation',
        },
      ],
    });

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "An error occurred while fetching exams." });
  }
};

export const getfullCertifExam = async(req: Request, res: Response) => {

try{
  const exams = await Exam.findAll({
    where: {
      obligatoire: false,
    },
    include: [
      {
        model: Answer,
        
      },
      {
        model: Reservation,
        as: 'reservation',
      },
    ],
  });
  
  // Transform the response to add student__name to each answer
  const transformedExams = await Promise.all(exams.map(async (exam) => {
    const transformedAnswers = await Promise.all(exam.answers.map(async (answer) => {
      const student = await Student.findOne({ where: { user__id: answer.Student__id } });
      return {
        ...answer.toJSON(),
        student__name: student ? `${student.first__name} ${student.last__name}` : null,
      };
    }));
  
    return {
      ...exam.toJSON(),
      answers: transformedAnswers,
    };
  }));
  
  res.status(200).json(transformedExams);
}catch (error) {
  console.error("Error fetching exams:", error);
  res.status(500).json({ error: "An error occurred while fetching exams." });
}


  
}



