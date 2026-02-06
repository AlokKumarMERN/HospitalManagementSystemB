import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing departments and doctors...');
    await Department.deleteMany({});
    await User.deleteMany({ role: { $in: ['doctor', 'admin'] } });

    // Create Departments
    console.log('Creating departments...');
    const departments = await Department.insertMany([
      {
        name: 'Cardiology',
        description: 'Heart and cardiovascular system care, including heart disease diagnosis and treatment',
        isActive: true,
      },
      {
        name: 'Neurology',
        description: 'Brain, spinal cord, and nervous system disorders treatment',
        isActive: true,
      },
      {
        name: 'Orthopedics',
        description: 'Bone, joint, ligament, tendon, and muscle care',
        isActive: true,
      },
      {
        name: 'Pediatrics',
        description: 'Comprehensive healthcare for infants, children, and adolescents',
        isActive: true,
      },
      {
        name: 'General Medicine',
        description: 'Primary care and general health issues treatment',
        isActive: true,
      },
      {
        name: 'Dermatology',
        description: 'Skin, hair, and nail conditions treatment',
        isActive: true,
      },
      {
        name: 'Gynecology',
        description: 'Women\'s reproductive health and wellness care',
        isActive: true,
      },
      {
        name: 'ENT (Ear, Nose, Throat)',
        description: 'Ear, nose, throat, and related head and neck conditions',
        isActive: true,
      },
    ]);

    console.log(`Created ${departments.length} departments`);

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@savelife.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1234567890',
      isActive: true,
    });
    console.log('Created admin user: admin@savelife.com / admin123');

    // Create Doctors
    console.log('Creating doctors...');
    const doctors = [
      // Cardiology Doctors
      {
        name: 'Dr. John Smith',
        email: 'john.smith@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543210',
        department: departments[0]._id,
        specialization: 'Interventional Cardiologist',
        qualification: 'MD, DM (Cardiology)',
        experience: 15,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Sarah Williams',
        email: 'sarah.williams@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543211',
        department: departments[0]._id,
        specialization: 'Cardiac Surgeon',
        qualification: 'MBBS, MS, MCh (Cardiothoracic Surgery)',
        experience: 12,
        gender: 'female',
        isActive: true,
      },
      // Neurology Doctors
      {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543212',
        department: departments[1]._id,
        specialization: 'Neurologist',
        qualification: 'MD, DM (Neurology)',
        experience: 10,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Emily Davis',
        email: 'emily.davis@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543213',
        department: departments[1]._id,
        specialization: 'Neurosurgeon',
        qualification: 'MBBS, MS, MCh (Neurosurgery)',
        experience: 14,
        gender: 'female',
        isActive: true,
      },
      // Orthopedics Doctors
      {
        name: 'Dr. James Wilson',
        email: 'james.wilson@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543214',
        department: departments[2]._id,
        specialization: 'Orthopedic Surgeon',
        qualification: 'MBBS, MS (Orthopedics)',
        experience: 11,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Lisa Anderson',
        email: 'lisa.anderson@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543215',
        department: departments[2]._id,
        specialization: 'Sports Medicine Specialist',
        qualification: 'MBBS, MS, Fellowship in Sports Medicine',
        experience: 8,
        gender: 'female',
        isActive: true,
      },
      // Pediatrics Doctors
      {
        name: 'Dr. Robert Taylor',
        email: 'robert.taylor@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543216',
        department: departments[3]._id,
        specialization: 'Pediatrician',
        qualification: 'MD (Pediatrics)',
        experience: 13,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Jennifer Martinez',
        email: 'jennifer.martinez@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543217',
        department: departments[3]._id,
        specialization: 'Neonatologist',
        qualification: 'MD, DM (Neonatology)',
        experience: 9,
        gender: 'female',
        isActive: true,
      },
      // General Medicine Doctors
      {
        name: 'Dr. David Johnson',
        email: 'david.johnson@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543218',
        department: departments[4]._id,
        specialization: 'General Physician',
        qualification: 'MBBS, MD (Internal Medicine)',
        experience: 16,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Mary Thomas',
        email: 'mary.thomas@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543219',
        department: departments[4]._id,
        specialization: 'Family Medicine',
        qualification: 'MBBS, MD (Family Medicine)',
        experience: 10,
        gender: 'female',
        isActive: true,
      },
      // Dermatology Doctors
      {
        name: 'Dr. Richard Garcia',
        email: 'richard.garcia@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543220',
        department: departments[5]._id,
        specialization: 'Dermatologist',
        qualification: 'MD (Dermatology)',
        experience: 7,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Patricia Lee',
        email: 'patricia.lee@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543221',
        department: departments[5]._id,
        specialization: 'Cosmetic Dermatologist',
        qualification: 'MD, Fellowship in Cosmetic Dermatology',
        experience: 6,
        gender: 'female',
        isActive: true,
      },
      // Gynecology Doctors
      {
        name: 'Dr. Linda White',
        email: 'linda.white@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543222',
        department: departments[6]._id,
        specialization: 'Gynecologist',
        qualification: 'MBBS, MD (Obstetrics & Gynecology)',
        experience: 12,
        gender: 'female',
        isActive: true,
      },
      {
        name: 'Dr. Susan Harris',
        email: 'susan.harris@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543223',
        department: departments[6]._id,
        specialization: 'Obstetrician',
        qualification: 'MBBS, MS (OB/GYN)',
        experience: 11,
        gender: 'female',
        isActive: true,
      },
      // ENT Doctors
      {
        name: 'Dr. Charles Clark',
        email: 'charles.clark@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543224',
        department: departments[7]._id,
        specialization: 'ENT Surgeon',
        qualification: 'MBBS, MS (ENT)',
        experience: 9,
        gender: 'male',
        isActive: true,
      },
      {
        name: 'Dr. Karen Lewis',
        email: 'karen.lewis@savelife.com',
        password: await bcrypt.hash('doctor123', 10),
        role: 'doctor',
        phone: '9876543225',
        department: departments[7]._id,
        specialization: 'Audiologist',
        qualification: 'MBBS, DNB (ENT), Audiology Certification',
        experience: 8,
        gender: 'female',
        isActive: true,
      },
    ];

    await User.insertMany(doctors);
    console.log(`Created ${doctors.length} doctors`);

    // Create Sample Patient
    const patient = await User.create({
      name: 'John Doe',
      email: 'patient@savelife.com',
      password: await bcrypt.hash('patient123', 10),
      role: 'patient',
      phone: '9999999999',
      address: '123 Main Street, City',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'male',
      isActive: true,
    });
    console.log('Created sample patient: patient@savelife.com / patient123');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Doctors: ${doctors.length}`);
    console.log(`   Admin: 1`);
    console.log(`   Sample Patient: 1`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@savelife.com / admin123');
    console.log('   Patient: patient@savelife.com / patient123');
    console.log('   Doctors: [firstname].[lastname]@savelife.com / doctor123');
    console.log('   Example: john.smith@savelife.com / doctor123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
