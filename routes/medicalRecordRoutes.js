import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
} from '../controllers/medicalRecordController.js';
import { protect, doctor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMedicalRecords)
  .post(protect, doctor, createMedicalRecord);

router.route('/:id')
  .get(protect, getMedicalRecordById)
  .put(protect, doctor, updateMedicalRecord);

export default router;
