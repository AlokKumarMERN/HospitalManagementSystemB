import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    testName: {
      type: String,
      required: true,
    },
    testType: {
      type: String,
    },
    result: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
    uploadedFile: {
      type: String, // File path/URL
    },
    uploadedFileName: {
      type: String, // Original file name
    },
    uploadedAt: {
      type: Date,
    },
    resultDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
testResultSchema.index({ patient: 1 }); // Index on patient
testResultSchema.index({ doctor: 1 }); // Index on doctor
testResultSchema.index({ appointment: 1 }); // Index on appointment
testResultSchema.index({ status: 1 }); // Index on status
testResultSchema.index({ patient: 1, status: 1 }); // Compound index for patient's tests by status
testResultSchema.index({ patient: 1, createdAt: -1 }); // Compound index for patient's tests sorted by date
testResultSchema.index({ doctor: 1, status: 1 }); // Compound index for doctor's tests by status

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
