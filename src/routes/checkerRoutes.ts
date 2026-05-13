import { Router } from 'express';

import {
    startChecker,
    stopChecker,
    getCheckerStatus,
} from '../services/appointmentChecker';

const router = Router();

router.post('/start', (_, res) => {
    const result = startChecker();

    res.json(result);
});

router.post('/stop', (_, res) => {
    const result = stopChecker();

    res.json(result);
});

router.get('/status', (_, res) => {
    res.json(getCheckerStatus());
});

export default router;