import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
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
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
prescriptionSchema.index({ patient: 1 }); // Index on patient
prescriptionSchema.index({ doctor: 1 }); // Index on doctor
prescriptionSchema.index({ appointment: 1 }); // Index on appointment
prescriptionSchema.index({ patient: 1, createdAt: -1 }); // Compound index for patient's prescriptions sorted by date
prescriptionSchema.index({ doctor: 1, createdAt: -1 }); // Compound index for doctor's prescriptions sorted by date

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
