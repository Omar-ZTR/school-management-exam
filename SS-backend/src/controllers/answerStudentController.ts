import { Request, Response } from "express";
import { Exam } from "../models/examModel";
import { Answer } from "../models/answerModel";
import { AnswerStudent } from "../models/answerStudentModel";
import { Question } from "../models/questionModel";
import { Reservation } from "../models/reservationModel";
import { Reponse } from "../models/reponseModel";
import { FileAnswer, FileQuestion } from "../models/fileModel";
import uploadFileMiddleware from "../utils/upload";
import { Student } from "../models/studentModel";
const baseUrl = "http://localhost:3000/files/";

// Create operation
export const createAnswers = async (req: Request, res: Response) => {
  try {
    await uploadFileMiddleware(req, res);

    const Answers = { ...req.body };
    const answersData = JSON.parse(Answers.ans);
    console.log("sssss", answersData.exam__id);
    const exam = await Exam.findByPk(answersData.exam__id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    const answer = await Answer.create(answersData);

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "answer",
          ans__id: answer.ans__id,
        };
        console.log("file attribute", support__files);
        await FileAnswer.create(support__files);
      }
    }

    if (
      answersData.answers &&
      Array.isArray(answersData.answers) &&
      answersData.answers.length > 0
    ) {
      console.log("if  fotnaha");
      const ansDatas = answersData.answers;
      for (const ansData of ansDatas) {
        console.log(
          ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
          ansData
        );
        const question = await Question.findByPk(ansData.question__id);
        if (!question) {
          return res.status(404).json({ message: "question not found" });
        }
        ansData.ans__id = answer.ans__id;
        await AnswerStudent.create(ansData);
      }
    }

    res.status(201).json(answer);
  } catch (error) {
    console.error("Error creation aswers", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Answer.update(req.body, { where: { ans__id: id } });
    if (updated) {
      const updatedResult = await Answer.findOne({ where: { ans__id: id } });
      res.status(200).json(updatedResult);
    } else {
      throw new Error("Result not found");
    }
  } catch (error) {
    console.error("Error updating result", error);
    res.status(500).send("Error updating result");
  }
};

export const getAnswers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exams = await Exam.findAll({
      include: [
        {
          model: Answer,

          include: [
            {
              model: AnswerStudent,
              as: "answers",
            },
            {
              model: FileAnswer,
            },
          ],
        },
      ],
      where: { user__id: id},
    });
    for (const e of exams) {
      console.log("exams is ", e.answers);
    }

    // const answers = await Answer.findAll({
    //   include: [

    //     {
    //       model: AnswerStudent,
    //       as: 'answers',
    //     },
    //     {
    //       model: FileAnswer,
    //     }
    //   ],
    // });

    let formattedAnswers: any[] = [];
    let formattedAnswersCertif: any[] = [];

    for (const exam of exams) {
      for (const answer of exam.answers) {
        if (exam.obligatoire == false) {
          formattedAnswersCertif.push(
            (async (answer) => {
              const examTitle = await getTitle(answer.exam__id);
              const nameStud = await getNamestudent(answer.Student__id);
              return {
                ans__id: answer.ans__id,
                exam__id: answer.exam__id,
                exam__title: examTitle,
                Student__id: answer.Student__id,
                Student__name: nameStud,
                ans__result: answer.ans__result,
                fileAnswer: answer.file.map((f: any) => ({
                  file__id: f.file__id,
                  file__name: f.file__name,
                  file__path: f.file__path,
                })),
                createdAt: answer.createdAt,
                updatedAt: answer.updatedAt,
                answers: answer.answers,
                ans__descreption: answer.ans__descreption,
              };
            })(answer)
          );
        } else {
          formattedAnswers.push(
            (async (answer) => {
              const examTitle = await getTitle(answer.exam__id);
              const nameStud = await getNamestudent(answer.Student__id);
              return {
                ans__id: answer.ans__id,
                exam__id: answer.exam__id,
                exam__title: examTitle,
                Student__id: answer.Student__id,
                Student__name: nameStud,
                ans__result: answer.ans__result,
                fileAnswer: answer.file.map((f: any) => ({
                  file__id: f.file__id,
                  file__name: f.file__name,
                  file__path: f.file__path,
                })),
                createdAt: answer.createdAt,
                updatedAt: answer.updatedAt,
                answers: answer.answers,
                ans__descreption: answer.ans__descreption,
              };
            })(answer)
          );
      
        }
      
      }
    }

    const ObliAnswers = await Promise.all(formattedAnswers);
    const CertifAnswers = await Promise.all(formattedAnswersCertif);

    res.status(200).json({
      ObliAnswers: ObliAnswers,
      CertifAnswers: CertifAnswers,
    });
  } catch (error) {
    console.error("Error fetching answers", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
async function GetQuestionById(questionId: number) {
  try {
    const question = await Question.findOne({
      where: {
        question__id: questionId,
      },
      attributes: ["question__id", "question__text"], // Adjust attributes as needed
      include: [
        {
          model: Reponse,
          as: "reponses",
        },
        {
          model: FileQuestion,
          as: "file",
        },
      ],
    });

    if (question) {
      return question;
    } else {
      throw new Error("Question not found");
    }
  } catch (error) {
    console.error("Error fetching question by question ID", error);
    throw error;
  }
}
async function getTitle(examid: number) {
  try {
    console.log("................................ exam id fi func", examid);

    const examTitle = await Exam.findOne({
      where: {
        exam__id: examid,
      },
      attributes: ["exam__title"],
    });
    if (!examTitle) {
      console.log("ssssssssssss");
    } else {
      console.log("kllllllllllllll", examTitle);
    }
    return examTitle!.exam__title;
  } catch (error) {
    console.error("Error fetching exam title by exam ID", error);
    throw error;
  }
}

async function getNamestudent(examid: number) {
  try {
    console.log("................................ exam id fi func", examid);

    const student = await Student.findOne({
      where: {
        user__id: examid,
      },
    });

    let allname = "";
    if (!student) {
      console.log("ssssssssssss");
    } else {
      allname = student.first__name + student.last__name;
      console.log("kllllllllllllll", allname);
    }
    return allname;
  } catch (error) {
    console.error("Error fetching exam title by exam ID", error);
    throw error;
  }
}
