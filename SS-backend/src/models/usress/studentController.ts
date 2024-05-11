// import { Request, Response } from "express";
// import { Student } from "../models/studentModel"; 

// // Create operation
// export const createStudent = async (req: Request, res: Response) => {
//     try {
//         const student = await Student.create(req.body);
//         res.status(201).json(student);
//     } catch (error) {
//         console.error("Error creating student", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Read operation - Get all students
// export const getAllStudents = async (req: Request, res: Response) => {
//     try {
//         const students = await Student.findAll();
//         res.status(200).json(students);
//     } catch (error) {
//         console.error("Error fetching students:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Read operation - Get student by ID
// export const getStudentById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const student = await Student.findByPk(id);
//         if (student) {
//             res.status(200).json(student);
//         } else {
//             res.status(404).json({ message: "Student not found" });
//         }
//     } catch (error) {
//         console.error("Error fetching student", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Update operation
// export const updateStudent = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const [updated] = await Student.update(req.body, { where: { user__id: id } });
//         if (updated) {
//             const updatedStudent = await Student.findOne({ where: { user__id: id } });
//             res.status(200).json(updatedStudent);
//         } else {
//             throw new Error('Student not found');
//         }
//     } catch (error) {
//         console.error("Error updating student", error);
//         res.status(500).send("Error updating student");
//     }
// };

// // Delete operation
// export const deleteStudent = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const deleted = await Student.destroy({ where: { user__id: id } });
//         if (deleted) {
//             res.status(204).send();
//         } else {
//             throw new Error('Student not found');
//         }
//     } catch (error) {
//         console.error("Error deleting student", error);
//         res.status(500).send("Error deleting student");
//     }
// };
