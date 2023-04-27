import { Router } from 'express';
import { sendTestSMS } from '../controllers/testController';

const router = Router();

router.post('/:testKey/:phone', sendTestSMS);

export default router;