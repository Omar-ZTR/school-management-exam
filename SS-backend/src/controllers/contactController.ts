import { Request, Response } from "express";
import { Contact } from "../models/contactModel";

// Create 
export const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.create(req.body);
    const newContact = await Contact.findOne({
      where: { contact__id: contact.contact__id },
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creation Contact", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all Contacts
export const getAllContacts = async (req: Request, res: Response) => {
  try {
const {email} = req.params

    const Contacts = await Contact.findAll({
        where:{
            recipient__email :email
        },
        order: [
          ['createdAt', 'DESC'] 
        ]
    });
    res.status(200).json(Contacts);
  } catch (error) {
    console.error("Error fetch Contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};