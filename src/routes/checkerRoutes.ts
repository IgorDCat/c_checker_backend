import { Router } from 'express';

import { checkAppointments } from '../services/appointmentChecker';

const router = Router();

router.post('/check', async (_, res) => {
    const result = await checkAppointments();

    res.json({
        success: true,
        result,
    });
});

export default router;
