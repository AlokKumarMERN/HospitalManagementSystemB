import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
departmentSchema.index({ isActive: 1 }); // Index on active status for filtering
departmentSchema.index({ name: 1, isActive: 1 }); // Compound index for name + status queries

const Department = mongoose.model('Department', departmentSchema);

export default Department;
