import asyncHandler from 'express-async-handler';
import Prescription from '../models/Prescription.js';

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
export const createPrescription = asyncHandler(async (req, res) => {
  const { patient, appointment, medications, notes } = req.body;

  const prescription = await Prescription.create({
    patient,
    doctor: req.user._id,
    appointment,
    medications,
    notes,
  });

  const populatedPrescription = await Prescription.findById(prescription._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.status(201).json(populatedPrescription);
});

// @desc    Get prescriptions
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'patient') {
    query.patient = req.user._id;
  } else if (req.user.role === 'doctor') {
    query.doctor = req.user._id;
  }

  const prescriptions = await Prescription.find(query)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization')
    .sort({ createdAt: -1 });

  res.json(prescriptions);
});

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    prescription.patient._id.toString() !== req.user._id.toString() &&
    prescription.doctor._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to access this prescription');
  }

  res.json(prescription);
});

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
export const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found');
  }

  // Only the doctor who created it can update
  if (prescription.doctor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this prescription');
  }

  const { medications, notes } = req.body;

  prescription.medications = medications || prescription.medications;
  prescription.notes = notes || prescription.notes;

  const updatedPrescription = await prescription.save();

  const populatedPrescription = await Prescription.findById(updatedPrescription._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.json(populatedPrescription);
});
