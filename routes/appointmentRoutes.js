import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  checkSlotAvailability,
  getAllAppointments,
} from '../controllers/appointmentController.js';
import { protect, admin, doctor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

router.get('/all', protect, admin, getAllAppointments);
router.get('/check-slot', protect, checkSlotAvailability);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, doctor, updateAppointment)
  .delete(protect, cancelAppointment);

export default router;
