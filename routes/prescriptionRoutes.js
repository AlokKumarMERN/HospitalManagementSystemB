import express from 'express';
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
} from '../controllers/prescriptionController.js';
import { protect, doctor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPrescriptions)
  .post(protect, doctor, createPrescription);

router.route('/:id')
  .get(protect, getPrescriptionById)
  .put(protect, doctor, updatePrescription);

export default router;
