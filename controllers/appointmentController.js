import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Department from '../models/Department.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, department, appointmentDate, appointmentTime, reason } = req.body;

  // Check if slot is available (exclude cancelled and completed appointments)
  const existingAppointment = await Appointment.findOne({
    doctor,
    appointmentDate,
    appointmentTime,
    status: { $nin: ['cancelled', 'completed'] },
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor,
    department,
    appointmentDate,
    appointmentTime,
    reason,
  });

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .populate('department', 'name');

  res.status(201).json(populatedAppointment);
});

// @desc    Get appointments for logged-in user
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'patient') {
    query.patient = req.user._id;
  } else if (req.user.role === 'doctor') {
    query.doctor = req.user._id;
  }

  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .populate('department', 'name')
    .sort({ appointmentDate: -1 });

  res.json(appointments);
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .populate('department', 'name');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if user has access to this appointment
  if (
    req.user.role !== 'admin' &&
    appointment.patient._id.toString() !== req.user._id.toString() &&
    appointment.doctor._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to access this appointment');
  }

  res.json(appointment);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Doctor/Admin)
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const { status, notes } = req.body;

  if (status) appointment.status = status;
  if (notes) appointment.notes = notes;

  const updatedAppointment = await appointment.save();

  const populatedAppointment = await Appointment.findById(updatedAppointment._id)
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .populate('department', 'name');

  res.json(populatedAppointment);
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    appointment.patient.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  res.json({ message: 'Appointment cancelled successfully' });
});

// @desc    Check slot availability
// @route   GET /api/appointments/check-slot
// @access  Private
export const checkSlotAvailability = asyncHandler(async (req, res) => {
  const { doctor, appointmentDate, appointmentTime } = req.query;

  const existingAppointment = await Appointment.findOne({
    doctor,
    appointmentDate,
    appointmentTime,
    status: { $nin: ['cancelled', 'completed'] },
  });

  res.json({ available: !existingAppointment });
});

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments/all
// @access  Private/Admin
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('patient', 'name email phone')
    .populate('doctor', 'name specialization')
    .populate('department', 'name')
    .sort({ appointmentDate: -1 });

  res.json(appointments);
});
