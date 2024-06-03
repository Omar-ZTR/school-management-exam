import express from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupsSubject,
} from '../controllers/groupController';

const routerGroup = express.Router();

routerGroup.get('/group', getAllGroups);

routerGroup.get('/groupSub/:exam__id', getGroupsSubject);

routerGroup.get('/group/:id', getGroupById);

routerGroup.post('/group', createGroup);


routerGroup.put('/group/:id', updateGroup);


routerGroup.delete('/group/:id', deleteGroup);

export default routerGroup;