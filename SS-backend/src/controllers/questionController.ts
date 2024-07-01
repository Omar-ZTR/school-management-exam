import { Question } from "../models/questionModel"; // Import your Question model
import { Request, Response } from "express";
import uploadFile from "../utils/upload";
import { Reponse } from "../models/reponseModel";
import {FileQuestion } from "../models/fileModel";
import { Exam } from "../models/examModel";
import uploadFileMiddleware from "../utils/upload";
const baseUrl = "http://localhost:3000/files/";
// Create operation
// export const createQuestion = async (req: Request, res: Response) => {
//   try {
//     console.log("exam 2", req.files);

//     await uploadFile(req, res); // Handle file upload
//     console.log("exam 3", req.file);
//     const questDatas = { ...req.body }; 
// console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>",questDatas)
//     // Assuming exam data is in req.body
//     console.log("exam 4", questDatas[0]);
//     const questionData = JSON.parse(questDatas.question);
//     console.log("Parsed question data:", questionData);
//     const question = await Question.create(questionData);
//     console.log("exam 6");
//     if (req.files && req.files.length != 0) {
//       console.log("file 7", req.file);

//       for (const file of req.files as Express.Multer.File[]) {
//         const support__files = {
//           file__name: file.originalname,
//           file__path: baseUrl + file.filename,
//           file__type: "Question",
//           question__id: question.question__id,
//         };
//         console.log("file attribute", support__files);
//         const filesup = await FileQuestion.create({
//           file__name: file.originalname,
//           file__path: baseUrl + file.filename,
//           file__type: "Question",
//           question__id: question.question__id,
//         });
//       }
//     }

//     console.log("file 8");
//     // Create the questions for the exam
//     if (
//       questDatas.reponses &&
//       Array.isArray(questDatas.reponses) &&
//       questDatas.reponses.length > 0
//     ) {
//       console.log("if ethanya fotnaha");
//       const responsesData = questDatas.reponses;
//       for (const responseData of responsesData) {
//         responseData.question__id = question.question__id;

//         await Reponse.create(responseData);
//       }
//     }

//     res.status(201).json(question);
//   } catch (error) {
//     console.error("Error creation exam", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



export const createQuestion = async (req: Request, res: Response) => {
  try {
    console.log("exam 2", req.files);

    await uploadFileMiddleware(req, res)
    console.log("exam 3", req.file);
    const questDatas = { ...req.body };
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>", questDatas);
    
    // Assuming exam data is in req.body
    console.log("exam 4", questDatas[0]);
    const questionData = JSON.parse(questDatas.question);
    console.log("Parsed question data:", questionData);

    const question = await Question.create(questionData);
    console.log("exam 6");
    
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      console.log("files 7", req.files);

      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "Question",
          question__id: question.question__id,
        };
        console.log("file attribute", support__files);
        await FileQuestion.create(support__files);
      }
    }

    console.log("file 8", questDatas);

    // Associate question with exam if exam__id is provided
    if (questionData.exam__id) {
      const exam = await Exam.findByPk(questionData.exam__id);
      if (exam) {
        await exam.$add('questions', question);
        console.log(`Associated question ${question.question__id} with exam ${questionData.exam__id}`);
      }
    }
    console.log(",,,,,,,,,,,,,,,,,,,,3332,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",questionData.reponses)
    // Create the responses for the question
    if (questionData.reponses && Array.isArray(questionData.reponses) && questionData.reponses.length > 0) {
      console.log("if ethanya fotnaha");
      const responsesData = questionData.reponses;
      for (const responseData of responsesData) {
        console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",responseData)
        responseData.question__id = question.question__id;
        await Reponse.create(responseData);
      }
    }

    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  console.log("Hello to update question >>>>>>>>>>>>>>>>>",req.body);
  try {
    const questionId = req.params.id;
     await uploadFileMiddleware(req, res) 
    // Handle the form data parsing
    const questDatas = {...req.body};
    console.log("Hddddddd>",questDatas);
  
    const questionData = JSON.parse(questDatas.question);
    console.log("ssssssss>",questionData);
    // Find the existing question
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Update question data
    await question.update(questionData);

    // Fetch existing responses and files
    const existingResponses = await Reponse.findAll({ where: { question__id: questionId } });
    // const existingFiles = await FileQuestion.findAll({ where: { question__id: questionId } });

    // Update or create new responses
    if (questionData.reponses && Array.isArray(questionData.reponses)) {
      const responseIds = questionData.reponses.map((response: any) => response.reponse__id);

      for (const responseData of questionData.reponses) {
        if (responseData.reponse__id) {
          // Update existing response
          const response = await Reponse.findByPk(responseData.reponse__id);
          if (response) {
            await response.update(responseData);
          }
        } else {
          // Create new response
          responseData.question__id = question.question__id;
          await Reponse.create(responseData);
        }
      }

      // Delete responses not in the updated data
      for (const response of existingResponses) {
        if (!responseIds.includes(response.reponse__id)) {
          await response.destroy();
        }
      }
    }

    // Handle file uploads
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      // const fileIds = (req.files as Express.Multer.File[]).map(file => file.filename);
      for (const file of req.files as Express.Multer.File[]) {
        const support__files = {
          file__name: file.originalname,
          file__path: baseUrl + file.filename,
          file__type: "Question",
          question__id: question.question__id,
        };
        await FileQuestion.create(support__files);
      }

      // Delete files not in the updated data
      // for (const file of existingFiles) {
      //   const filePathParts = file.file__path ? file.file__path.split('/') : [];
      //   const fileName = filePathParts.pop();
      //   if (fileName && !fileIds.includes(fileName)) {
      //     await file.destroy();
      //   }
      // }
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error updating question", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// getby Id

export const QuestionById = async (req: Request, res: Response) => {
  try {
    const id = req.params;
  
   
    const questions = await Question.findOne({
      where: {
        question__id: id,
      },
      
      include: [
        {
          model: Reponse,
          as: 'reponses',
        },
        {
          model: FileQuestion,
          as: 'file',
        },
      ],
    });
  console.log("<><<<>>",questions)
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions with files", error);
    res.status(500).json({ error: "Internal server error" });
  }
  };




// Get fake Question 

export const getFakeQuestions = async (req: Request, res: Response) => {
try {
  const examId = -1;

 
  const questions = await Question.findAll({
    include: [
      {
        model: Exam,
        as: 'exams',
        where: { exam__id: examId },
        through: { attributes: [] } // Exclude join table attributes
      },
      {
        model: FileQuestion,
        as: 'file',
        required: false,
      },
    ],
  });
console.log("<><<<>>",questions)
  res.status(200).json(questions);
} catch (error) {
  console.error("Error fetching questions with files", error);
  res.status(500).json({ error: "Internal server error" });
}
};



export const updateQuestionsWithExam = async (req: Request, res: Response) => {
  try {
    const { exam__id, questionIds } = req.body;

    if (!exam__id || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const exam = await Exam.findByPk(exam__id);

    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const questions = await Question.findAll({
      where: {
        question__id: questionIds,
      },
    });

    if (questions.length !== questionIds.length) {
      return res.status(404).json({ error: "One or more questions not found" });
    }

    await exam.$add('questions', questions);

    return questions;
  } catch (error) {
    console.error("Error updating questions with exam", error);
    res.status(500).json({ error: "Internal server error" });
  }
};











export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error("Error fetch question", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Read operation - Get all questions
export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.findAll();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetch questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update operation


// Delete operation
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("hay bb")

    const deleteData = req.body.model
    console.log("hay req",deleteData)
    if(deleteData.action==='delete'){
      const question = await Question.findByPk(id);
      if (question) {
        await question.destroy();
        console.log(`Deleted question with ID ${id}`);
        res.status(204).send();
      } else {
        console.log(`Question with ID ${id} not found`);
        throw new Error("Question not found");
      }
   
  }
  if(deleteData.action !=='delete'){
    const message=unassociateQuestionFromExam(deleteData.exam__id,id)
    res.status(204).send(message);
  }
  } catch (error) {
    console.error("Error deleting question", error);
    res.status(500).send("Error deleting question");
  }
};


async function unassociateQuestionFromExam(examId: number, questionId: any) {
  try {
    // Find the exam and question instances
    const exam = await Exam.findByPk(examId);
    const question = await Question.findByPk(questionId);

    if (exam && question) {
      // Unassociate the question from the exam
      await exam.$remove('questions', question);
     return(`Unassociated question ${question.question__id} from exam ${exam.exam__id}`);
    } else {
      return('Exam or Question not found');
    }
  } catch (error) {
    console.error('Error unassociating question from exam:', error);
  }
}