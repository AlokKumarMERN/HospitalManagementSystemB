import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
      default: 'scheduled',
    },
    reason: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
appointmentSchema.index({ patient: 1 }); // Index on patient for quick patient queries
appointmentSchema.index({ doctor: 1 }); // Index on doctor for quick doctor queries
appointmentSchema.index({ appointmentDate: 1 }); // Index on date for date-based queries
appointmentSchema.index({ status: 1 }); // Index on status for filtering
appointmentSchema.index({ doctor: 1, appointmentDate: 1, appointmentTime: 1 }); // Compound index for slot checking
appointmentSchema.index({ patient: 1, status: 1 }); // Compound index for patient's appointments by status
appointmentSchema.index({ doctor: 1, status: 1 }); // Compound index for doctor's appointments by status
appointmentSchema.index({ appointmentDate: 1, status: 1 }); // Compound index for date + status queries

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
