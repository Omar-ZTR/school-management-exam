"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salleController_1 = require("../controllers/salleController");
const routerSalle = express_1.default.Router();
routerSalle.get('/salle', salleController_1.getAllSalles);
routerSalle.post('/salleSpecific', salleController_1.getSallesSpecific);
routerSalle.get('/salle/:id', salleController_1.getSalleById);
routerSalle.get('/salleCheckRe/:id', salleController_1.CheckSalles);
routerSalle.post('/salle', salleController_1.createSalle);
routerSalle.put('/salle/:id', salleController_1.updateSalle);
routerSalle.delete('/salle/:id', salleController_1.deleteSalle);
exports.default = routerSalle;
