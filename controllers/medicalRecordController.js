import asyncHandler from 'express-async-handler';
import MedicalRecord from '../models/MedicalRecord.js';

// @desc    Create medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
export const createMedicalRecord = asyncHandler(async (req, res) => {
  const { patient, appointment, diagnosis, symptoms, treatment, notes } = req.body;

  const medicalRecord = await MedicalRecord.create({
    patient,
    doctor: req.user._id,
    appointment,
    diagnosis,
    symptoms,
    treatment,
    notes,
  });

  const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.status(201).json(populatedRecord);
});

// @desc    Get medical records
// @route   GET /api/medical-records
// @access  Private
export const getMedicalRecords = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'patient') {
    query.patient = req.user._id;
  } else if (req.user.role === 'doctor') {
    query.doctor = req.user._id;
  }

  const medicalRecords = await MedicalRecord.find(query)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization')
    .sort({ createdAt: -1 });

  res.json(medicalRecords);
});

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
export const getMedicalRecordById = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  if (!medicalRecord) {
    res.status(404);
    throw new Error('Medical record not found');
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    medicalRecord.patient._id.toString() !== req.user._id.toString() &&
    medicalRecord.doctor._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to access this medical record');
  }

  res.json(medicalRecord);
});

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor)
export const updateMedicalRecord = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    res.status(404);
    throw new Error('Medical record not found');
  }

  // Only the doctor who created it can update
  if (medicalRecord.doctor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this medical record');
  }

  const { diagnosis, symptoms, treatment, notes } = req.body;

  medicalRecord.diagnosis = diagnosis || medicalRecord.diagnosis;
  medicalRecord.symptoms = symptoms || medicalRecord.symptoms;
  medicalRecord.treatment = treatment || medicalRecord.treatment;
  medicalRecord.notes = notes || medicalRecord.notes;

  const updatedRecord = await medicalRecord.save();

  const populatedRecord = await MedicalRecord.findById(updatedRecord._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.json(populatedRecord);
});
