import express from 'express';
import {
  createTestResult,
  getTestResults,
  getTestResultById,
  updateTestResult,
  uploadTestResultFile,
} from '../controllers/testResultController.js';
import { protect, doctor } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, getTestResults)
  .post(protect, doctor, createTestResult);

router.route('/:id')
  .get(protect, getTestResultById)
  .put(protect, doctor, updateTestResult);

// Patient upload route
router.post('/:id/upload', protect, upload.single('testFile'), uploadTestResultFile);

export default router;
