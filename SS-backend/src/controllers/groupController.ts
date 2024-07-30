import { Op } from "sequelize";
import { Group } from "../models/groupModel"; // Import your Group model
import { Request, Response } from "express";
import { Subject } from "../models/subjectModel";
import { Exam } from "../models/examModel";
import { Student } from "../models/studentModel";
import { Teacher } from "../models/teacherModel";
import { Answer } from "../models/answerModel";
import { Reservation } from "../models/reservationModel";

// Create operation
export const createGroup = async (req: Request, res: Response) => {
  try {
    const groupData = req.body;
    const group = await Group.create(groupData);

    if (
      group &&
      groupData.subjects &&
      Array.isArray(groupData.subjects) &&
      groupData.subjects.length > 0
    ) {
      const subjects = await Subject.findAll({
        where: {
          subject__id: groupData.subjects,
        },
      });

      await group.$set("subjects", subjects);
    }
    const newGroup = await Group.findOne({ where: { group__id: group.group__id }, include: [
      {
        model: Subject,
        as: "subjects",
      },
    ], });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creation Group", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Read operation - Get all Groups
export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: Subject,
          as: "subjects",
        },
      ],
    });
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetch Group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getFullGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: Subject,
          as: 'subjects',
        },
        {
          model: Exam,
          as: 'exams',
        },
        {
          model: Student,
          as: 'students',
          
        },
        {
          model: Teacher,
          as: 'teachers',
        },
      ],
    });
    const result = await Promise.all(groups.map(async group => {
      const subjects = await Promise.all(group.subjects.map(async subject => {
        const exams = await Promise.all(group.exams.filter((ex:any) => ex.subject === subject.subject__name).map(async exam => {
          const students = await Promise.all(group.students.map(async student => {
            const answer = await Answer.findOne({
              where: {
                Student__id: student.user__id,
                exam__id: exam.exam__id,
              }
            });

            return {
              user__name: student.first__name,
              ans__result: answer ? answer.ans__result : null,
              ans__id: answer ? answer.ans__id : null,
            };
          }));
          const res = await checkExam(group.group__name, exam.exam__id);
          if (res) {
            return {
              exam__title: exam.exam__title,
              students,
              date: res.startDate
            };
          } else {
            return {
              exam__title: exam.exam__title,
              students,
              date: ''
            };
          }
        
        }));

        return {
          id: subject.subject__id,
          subject__name: subject.subject__name,
          exams,
        };
      }));

      return {
        group__name: group.group__name,
        subjects,
      };
    }));

    res.status(200).json(result);
  
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal server error' });
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

export const getGroupsSubject = async (req: Request, res: Response) => {
  console.log("id is : ", req.params);
  try {
    const { exam__id } = req.params;

    console.log("idExam is : ", exam__id);
    const exam = await Exam.findByPk(exam__id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const subjectName = exam.subject;

    console.log("sub is : ", subjectName);
    const subject = await Subject.findOne({
      where: { subject__name: subjectName },
    });
    console.log("hhhay: ", subject);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const groupSubject = await Group.findAll({
      include: {
        model: Subject,
        where: { subject__name: subjectName },
        through: { attributes: [] },
      },
    });
    console.log("gr hay : ", groupSubject);
    const groupsRank = await Group.findAll({
      where: {
        Rank: {
          [Op.gte]: subject.min__Rank,
        },
      },
    });
    console.log("reee: ", groupsRank);

    res.json({
      groupsSubject: groupSubject,
      groupsRank: groupsRank,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (Group) {
      res.status(200).json(Group);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.error("Error fetch Group", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update operation
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
const groupData = req.body
const groupExist = await Group.findByPk(id);

if (!groupExist) {
    return res.status(404).json({ error: 'group not found' });
}
    if (
        
        groupData.subjects &&
        Array.isArray(groupData.subjects) &&
        groupData.subjects.length > 0
      ) {
        const subjects = await Subject.findAll({
          where: {
            subject__id: groupData.subjects,
          },
        });
  
        await groupExist.$set("subjects", subjects);
      }else {
        // If no groups are provided or the array is empty, delete all associations
        await groupExist.$set('subjects', []);
    }
if(groupExist.group__name !== groupData.group__name){
    const [updated] = await Group.update(req.body, {
      where: { group__id: id },
    });
    if (!updated) {
 
      throw new Error("Group not found");
    }
}
const updatedGroup = await Group.findOne({ where: { group__id: id } });
res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating Group", error);
    res.status(500).send("Error updating Group");
  }
};

// Delete operation
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Group.destroy({ where: { group__id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      throw new Error("Group not found");
    }
  } catch (error) {
    console.error("Error deleting Group", error);
    res.status(500).send("Error deleting Group");
  }
};
