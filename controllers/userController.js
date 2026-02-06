import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  
  let query = {};
  if (role) {
    query.role = role;
  }

  const users = await User.find(query).populate('department', 'name');
  res.json(users);
});

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, department, specialization, qualification, experience } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user data
  const userData = {
    name,
    email,
    password,
    role: role || 'patient',
    phone,
    address: req.body.address,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
  };

  // Add doctor-specific fields
  if (role === 'doctor') {
    userData.department = department;
    userData.specialization = specialization;
    userData.qualification = qualification;
    userData.experience = experience;
  }

  const user = await User.create(userData);

  // Populate department for response
  await user.populate('department', 'name description');

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    department: user.department,
    specialization: user.specialization,
  });
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;
  user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
  user.gender = req.body.gender || user.gender;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

  if (user.role === 'doctor') {
    user.department = req.body.department || user.department;
    user.specialization = req.body.specialization || user.specialization;
    user.qualification = req.body.qualification || user.qualification;
    user.experience = req.body.experience || user.experience;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  // Populate department for response
  await updatedUser.populate('department', 'name description');

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    phone: updatedUser.phone,
    department: updatedUser.department,
    specialization: updatedUser.specialization,
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isActive = false;
  await user.save();

  res.json({ message: 'User deactivated successfully' });
});
