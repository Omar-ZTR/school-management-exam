import express from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupsSubject,
  getFullGroups,
  getTeacherGroups,
} from '../controllers/groupController';

const routerGroup = express.Router();

routerGroup.get('/group', getAllGroups);


routerGroup.get('/teachergroup', getTeacherGroups);

routerGroup.get('/fullgroup', getFullGroups);

routerGroup.get('/groupSub/:exam__id', getGroupsSubject);

routerGroup.get('/group/:id', getGroupById);

routerGroup.post('/group', createGroup);


routerGroup.put('/group/:id', updateGroup);


routerGroup.delete('/group/:id', deleteGroup);

export default routerGroup;