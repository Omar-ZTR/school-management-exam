import express from 'express';

import { createSubscribe, getOneSubscribe, getAllSubscribes, updateSubscribe, getSubscribeExam } from '../controllers/subscribeController';



const routerSubscribe = express.Router();

routerSubscribe.post('/subscribe', createSubscribe);

routerSubscribe.get('/subscribe/:exam__id/:user__id', getOneSubscribe);

routerSubscribe.get('/subscribe', getAllSubscribes);

routerSubscribe.get('/subExAm/:id', getSubscribeExam);

routerSubscribe.put('/subscribes/:subscribe__id', updateSubscribe);
export default routerSubscribe;