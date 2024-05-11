"use strict";
// import { Teacher } from "../models/teacherModel"; // Import your Teacher model
// import { Request, Response } from "express";
// // Create operation
// export const createTeacher = async (req: Request, res: Response) => {
//     try {
//         const teacher = await Teacher.create(req.body);
//         res.status(201).json(teacher);
//     } catch (error) {
//         console.error("Error creating teacher", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
// // Read operation - Get all teachers
// export const getAllTeachers = async (req: Request, res: Response) => {
//     try {
//         const teachers = await Teacher.findAll();
//         res.status(200).json(teachers);
//     } catch (error) {
//         console.error("Error fetching teachers:", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
// // Read operation - Get teacher by ID
// export const getTeacherById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const teacher = await Teacher.findByPk(id);
//         if (teacher) {
//             res.status(200).json(teacher);
//         } else {
//             res.status(404).json({ message: "Teacher not found" });
//         }
//     } catch (error) {
//         console.error("Error fetching teacher", error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
// // Update operation
// export const updateTeacher = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const [updated] = await Teacher.update(req.body, { where: { user__id: id } });
//         if (updated) {
//             const updatedTeacher = await Teacher.findOne({ where: { user__id: id } });
//             res.status(200).json(updatedTeacher);
//         } else {
//             throw new Error('Teacher not found');
//         }
//     } catch (error) {
//         console.error("Error updating teacher", error);
//         res.status(500).send("Error updating teacher");
//     }
// };
// // Delete operation
// export const deleteTeacher = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const deleted = await Teacher.destroy({ where: { user__id: id } });
//         if (deleted) {
//             res.status(204).send();
//         } else {
//             throw new Error('Teacher not found');
//         }
//     } catch (error) {
//         console.error("Error deleting teacher", error);
//         res.status(500).send("Error deleting teacher");
//     }
// };
