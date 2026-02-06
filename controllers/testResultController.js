import asyncHandler from 'express-async-handler';
import TestResult from '../models/TestResult.js';

// @desc    Create test result/requirement
// @route   POST /api/test-results
// @access  Private (Doctor)
export const createTestResult = asyncHandler(async (req, res) => {
  const { patient, appointment, testName, testType, result, status, notes } = req.body;

  const testResult = await TestResult.create({
    patient,
    doctor: req.user._id,
    appointment,
    testName,
    testType,
    result,
    status: status || 'pending',
    notes,
  });

  const populatedTestResult = await TestResult.findById(testResult._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.status(201).json(populatedTestResult);
});

// @desc    Get test results
// @route   GET /api/test-results
// @access  Private
export const getTestResults = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'patient') {
    query.patient = req.user._id;
  } else if (req.user.role === 'doctor') {
    query.doctor = req.user._id;
  }

  const testResults = await TestResult.find(query)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization')
    .sort({ createdAt: -1 });

  res.json(testResults);
});

// @desc    Get single test result
// @route   GET /api/test-results/:id
// @access  Private
export const getTestResultById = asyncHandler(async (req, res) => {
  const testResult = await TestResult.findById(req.params.id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  if (!testResult) {
    res.status(404);
    throw new Error('Test result not found');
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    testResult.patient._id.toString() !== req.user._id.toString() &&
    testResult.doctor._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to access this test result');
  }

  res.json(testResult);
});

// @desc    Update test result
// @route   PUT /api/test-results/:id
// @access  Private (Doctor)
export const updateTestResult = asyncHandler(async (req, res) => {
  const testResult = await TestResult.findById(req.params.id);

  if (!testResult) {
    res.status(404);
    throw new Error('Test result not found');
  }

  // Only the doctor who created it can update
  if (testResult.doctor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this test result');
  }

  const { testName, testType, result, status, notes } = req.body;

  testResult.testName = testName || testResult.testName;
  testResult.testType = testType || testResult.testType;
  testResult.result = result || testResult.result;
  testResult.status = status || testResult.status;
  testResult.notes = notes || testResult.notes;

  const updatedTestResult = await testResult.save();

  const populatedTestResult = await TestResult.findById(updatedTestResult._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.json(populatedTestResult);
});

// @desc    Upload test result file (Patient)
// @route   POST /api/test-results/:id/upload
// @access  Private (Patient)
export const uploadTestResultFile = asyncHandler(async (req, res) => {
  const testResult = await TestResult.findById(req.params.id);

  if (!testResult) {
    res.status(404);
    throw new Error('Test result not found');
  }

  // Only the patient can upload their test result
  if (testResult.patient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to upload file for this test');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Update test result with uploaded file info
  testResult.uploadedFile = req.file.filename; // Store just filename for URL construction
  testResult.uploadedFileName = req.file.originalname;
  testResult.uploadedAt = new Date();
  testResult.status = 'completed';
  testResult.resultDate = new Date();

  const updatedTestResult = await testResult.save();

  const populatedTestResult = await TestResult.findById(updatedTestResult._id)
    .populate('patient', 'name email')
    .populate('doctor', 'name specialization');

  res.json(populatedTestResult);
});

// @desc    Delete test result
// @route   DELETE /api/test-results/:id
// @access  Private (Doctor)
export const deleteTestResult = asyncHandler(async (req, res) => {
  const testResult = await TestResult.findById(req.params.id);

  if (!testResult) {
    res.status(404);
    throw new Error('Test result not found');
  }

  await testResult.deleteOne();

  res.json({ message: 'Test result removed' });
});
