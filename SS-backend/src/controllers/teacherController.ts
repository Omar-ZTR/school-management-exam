
import { Request, Response } from "express";
import { Teacher } from "../models/teacherModel";
import { Subject } from "../models/subjectModel";
import { Group } from "../models/groupModel";


export const getAllTeacher = async (req: Request, res: Response) => {
    try {
        const Teachers = await Teacher.findAll(
         {   include: [
                {
                  model: Subject,
                  as: 'subjects',
                },
                {
                  model: Group,
                  as: 'groups',
                },
              ],}
        );
        console.log("teachers is : ",Teachers)
        res.status(200).json(Teachers);
    } catch (error) {
        console.error("Error fetch Teacher:", error);
        res.status(500).json({ error: 'Internal server error' });
    };
}


export const updateTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teacherData = req.body;

        const teacherExist = await Teacher.findByPk(id);

        if (!teacherExist) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        console.log("teacherData.subjects", teacherData.subjects);

        if (teacherData.groups && Array.isArray(teacherData.groups) && teacherData.groups.length > 0) {
            const groups = await Group.findAll({
                where: {
                    group__id: teacherData.groups,
                },
            });

            await teacherExist.$set('groups', groups);
        }else {
            // If no groups are provided or the array is empty, delete all associations
            await teacherExist.$set('groups', []);
        }
        if (teacherData.subjects && Array.isArray(teacherData.subjects) && teacherData.subjects.length > 0) {
            const subjects = await Subject.findAll({
                where: {
                    subject__id: teacherData.subjects,
                },
            });

            await teacherExist.$set('subjects', subjects);
        }else {
            // If no groups are provided or the array is empty, delete all associations
            await teacherExist.$set('subjects', []);
        }

        if (teacherExist.active !== teacherData.active) {
            const [updated] = await Teacher.update(teacherData, { where: { user__id: id } });

            if (updated) {
                const updatedTeacher = await Teacher.findOne({ where: { user__id: id } });
                return res.status(200).json(updatedTeacher);
            } else {
                throw new Error('Teacher not updated');
            }
        }   // If no updates were made, return the current teacher data
        return res.status(200).json(teacherExist);
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).send('Error updating teacher');
    }
};

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Teacher.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Teacher not found');
        }
    } catch (error) {
        console.error("Error deleting Teacher", error);
        res.status(500).send("Error deleting Teacher"); 
    }
};