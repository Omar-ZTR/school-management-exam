"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const routerGroup = express_1.default.Router();
routerGroup.get('/group', groupController_1.getAllGroups);
routerGroup.get('/fullgroup', groupController_1.getFullGroups);
routerGroup.get('/groupSub/:exam__id', groupController_1.getGroupsSubject);
routerGroup.get('/group/:id', groupController_1.getGroupById);
routerGroup.post('/group', groupController_1.createGroup);
routerGroup.put('/group/:id', groupController_1.updateGroup);
routerGroup.delete('/group/:id', groupController_1.deleteGroup);
exports.default = routerGroup;
