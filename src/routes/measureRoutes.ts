import { Router } from 'express';
import { uploadImage, confirmMeasure, listMeasuresByCustomer } from '../controllers/measureController';

const router = Router();

router.post('/upload', uploadImage);
router.patch('/confirm', confirmMeasure);
router.get('/:customer_code/list', listMeasuresByCustomer);

export default router;
