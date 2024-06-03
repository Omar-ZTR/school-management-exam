import { Op } from "sequelize";
import { Group } from "../models/groupModel"; // Import your Group model
import { Request, Response } from "express";
import { Subject } from "../models/subjectModel";
import { Exam } from "../models/examModel";

// Create operation
export const createGroup = async (req: Request, res: Response) => {
    try {
        const group = await Group.create(req.body);
        res.status(201).json(Group);
    } catch (error) {
        console.error("Error creation Group", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Read operation - Get all Groups
export const getAllGroups = async (req: Request, res: Response) => {
    try {
        const groups = await Group.findAll();
        res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetch Group:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const getGroupsSubject = async (req: Request, res: Response) => {
   
console.log("id is : " ,req.params)
    try {
        const { exam__id } = req.params;

        console.log("idExam is : ",exam__id)
        const exam = await Exam.findByPk(exam__id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const subjectName = exam.subject;

        console.log("sub is : ",subjectName)
        const subject = await Subject.findOne({ where: { subject__name: subjectName } });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

      
        const groupSubject = await Group.findAll({
            include: {
                model: Subject,
                where: { subject__name: subjectName },
                through: { attributes: [] }, 
            }
        });

        const groupsRank = await Group.findAll({
            where: {
                Rank: {
                    [Op.gte]: subject.min__Rank
                }
            }
        });

    
      
        res.json({
            groupsSubject: groupSubject,
            groupsRank: groupsRank
        });

    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ error: 'Internal server error' });
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
        res.status(500).json({ error: 'Internal server error' }); 
    }
};

// Update operation
export const updateGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updated] = await Group.update(req.body, { where: { group__id: id } });
        if (updated) {
            const updatedGroup = await Group.findOne({ where: { group__id: id } });
            res.status(200).json(updatedGroup);
        } else {
            throw new Error('Group not found');
        }
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
            throw new Error('Group not found');
        }
    } catch (error) {
        console.error("Error deleting Group", error);
        res.status(500).send("Error deleting Group"); 
    }
};
