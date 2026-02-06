import asyncHandler from 'express-async-handler';
import Department from '../models/Department.js';
import User from '../models/User.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({ isActive: true });
  res.json(departments);
});

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
export const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  res.json(department);
});

// @desc    Get doctors by department
// @route   GET /api/departments/:id/doctors
// @access  Public
export const getDoctorsByDepartment = asyncHandler(async (req, res) => {
  const doctors = await User.find({
    role: 'doctor',
    department: req.params.id,
    isActive: true,
  }).select('name email specialization qualification experience');

  res.json(doctors);
});

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const departmentExists = await Department.findOne({ name });

  if (departmentExists) {
    res.status(400);
    throw new Error('Department already exists');
  }

  const department = await Department.create({
    name,
    description,
  });

  res.status(201).json(department);
});

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  department.name = req.body.name || department.name;
  department.description = req.body.description || department.description;
  department.isActive = req.body.isActive !== undefined ? req.body.isActive : department.isActive;

  const updatedDepartment = await department.save();
  res.json(updatedDepartment);
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id);

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  department.isActive = false;
  await department.save();

  res.json({ message: 'Department deactivated successfully' });
});
