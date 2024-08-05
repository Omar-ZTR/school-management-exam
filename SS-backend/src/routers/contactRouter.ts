import express from 'express';
import { createContact, getAllContacts } from '../controllers/contactController';




const routerContact = express.Router();

routerContact.post('/contact', createContact);



routerContact.get('/contact/:email', getAllContacts);


export default routerContact;