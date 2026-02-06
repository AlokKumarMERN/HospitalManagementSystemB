import express from 'express';
import {
  getDepartments,
  getDepartmentById,
  getDoctorsByDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDepartments)
  .post(protect, admin, createDepartment);

router.route('/:id')
  .get(getDepartmentById)
  .put(protect, admin, updateDepartment)
  .delete(protect, admin, deleteDepartment);

router.get('/:id/doctors', getDoctorsByDepartment);

export default router;
