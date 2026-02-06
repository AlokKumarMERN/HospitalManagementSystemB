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

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
