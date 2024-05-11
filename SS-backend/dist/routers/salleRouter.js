"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salleController_1 = require("../controllers/salleController");
const routerSalle = express_1.default.Router();
routerSalle.get('/', salleController_1.getAllSalles);
routerSalle.get('/Salle/:id', salleController_1.getSalleById);
routerSalle.post('/Salles', salleController_1.createSalle);
routerSalle.put('/Salles/:id', salleController_1.updateSalle);
routerSalle.delete('/Salles/:id', salleController_1.deleteSalle);
exports.default = routerSalle;
