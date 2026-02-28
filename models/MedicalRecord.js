import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
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
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
    },
    treatment: {
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
medicalRecordSchema.index({ patient: 1 }); // Index on patient
medicalRecordSchema.index({ doctor: 1 }); // Index on doctor
medicalRecordSchema.index({ appointment: 1 }); // Index on appointment
medicalRecordSchema.index({ patient: 1, createdAt: -1 }); // Compound index for patient's records sorted by date
medicalRecordSchema.index({ doctor: 1, createdAt: -1 }); // Compound index for doctor's records sorted by date

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
