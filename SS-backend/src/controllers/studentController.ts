
import { Request, Response } from "express";
import { Student } from "../models/studentModel";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";



export const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await Student.findAll();
        console.log("studens is : ",students)
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetch student:", error);
        res.status(500).json({ error: 'Internal server error' });
    };
}
export const getMonthlyStudentCount = async (req: Request, res: Response) => {
    try {
        const currentYear = new Date().getFullYear();
        const monthNames: { [key: number]: string } = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };
        const studentCounts = await Student.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('user__id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']]
        });
        const formattedCounts = studentCounts.map((item: any) => ({
            month: monthNames[item.getDataValue('month')],
            count: item.getDataValue('count')
        }));

        res.status(200).json(formattedCounts);
    } catch (error) {
        console.error("Error fetching monthly student count:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const getChartStudentCount = async (req: Request, res: Response) => {
    try {
        const { firstDate, endDate } = req.body;

        const monthNames: { [key: number]: string } = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };

        const studentCounts = await Student.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('user__id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [firstDate, endDate]
                }
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']]
        });

        const formattedCounts = studentCounts.map((item: any) => ({
            month: monthNames[item.getDataValue('month')],
            count: item.getDataValue('count')
        }));

        res.status(200).json(formattedCounts);
    } catch (error) {
        console.error("Error fetching monthly student count:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getDaysStudentCount = async (req: Request, res: Response) => {
    try {
        const { firstDate, endDate } = req.body;

        const startDate = new Date(firstDate);
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1); // Increment by one day to include the end date

        const monthNames: { [key: number]: string } = {
            0: 'janvier',
            1: 'février',
            2: 'mars',
            3: 'avril',
            4: 'mai',
            5: 'juin',
            6: 'juillet',
            7: 'août',
            8: 'septembre',
            9: 'octobre',
            10: 'novembre',
            11: 'décembre'
        };

        const studentCounts = await Student.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
                [Sequelize.fn('COUNT', Sequelize.col('user__id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDateObj]
                }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']]
        });

        const formattedCounts = studentCounts.map((item: any) => ({
            date: item.getDataValue('date'),
            count: item.getDataValue('count')
        }));

        res.status(200).json(formattedCounts);
    } catch (error) {
        console.error("Error fetching monthly student count:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Student.destroy({ where: { user__id: id } });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Student not found');
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
            where: { user__id: id }
        });

        if (updated) {
            const updatedStudent = await Student.findOne({ where: { user__id: id } });
            res.status(200).json(updatedStudent);
        } else {
            throw new Error('Student not found');
        }
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
