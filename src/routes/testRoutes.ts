import { Router } from 'express';
import { sendTestSMS } from '../controllers/testController';

const router = Router();

router.get('/:testKey/:phone', sendTestSMS);

export default router;