import express from 'express';

import { createSubscribe, getOneSubscribe, getAllSubscribes } from '../controllers/subscribeController';



const routerSubscribe = express.Router();

routerSubscribe.post('/subscribe', createSubscribe);

routerSubscribe.get('/subscribe/:exam__id/:user__id', getOneSubscribe);

routerSubscribe.get('/subscribe', getAllSubscribes);


export default routerSubscribe;