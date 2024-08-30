import { Router } from 'express';
import { createMeasure, confirmMeasure, getMeasuresByCustomerCode } from './controllers/measureController';
const router = Router();

router.post('/upload', createMeasure);
router.patch('/confirm', confirmMeasure);
router.get('/:customer_code/list', getMeasuresByCustomerCode);

export default router;