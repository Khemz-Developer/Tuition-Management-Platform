import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Note: This is a simplified seed script. In production, use proper model imports
// For now, this creates basic users directly via mongoose

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['ADMIN', 'TEACHER', 'STUDENT'] },
  firstName: String,
  lastName: String,
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TeacherProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subjects: { type: [String], required: true },
  grades: { type: [String], required: true },
  bio: String,
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const StudentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  grade: { type: String, required: true },
  school: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const TeacherProfile = mongoose.model('TeacherProfile', TeacherProfileSchema);
const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tuition-management';
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
    // await User.deleteMany({});
    // await TeacherProfile.deleteMany({});
    // await StudentProfile.deleteMany({});

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        emailVerified: true,
      },
      { upsert: true, new: true }
    );
    console.log('Admin created:', admin.email);

    // Create Teachers
    const teacher1Password = await bcrypt.hash('teacher123', 10);
    const teacher1User = await User.findOneAndUpdate(
      { email: 'teacher1@example.com' },
      {
        email: 'teacher1@example.com',
        password: teacher1Password,
        role: 'TEACHER',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
        emailVerified: true,
      },
      { upsert: true, new: true }
    );

    const teacher1Profile = await TeacherProfile.findOneAndUpdate(
      { userId: teacher1User._id },
      {
        userId: teacher1User._id,
        firstName: 'Jane',
        lastName: 'Smith',
        slug: 'jane-smith',
        subjects: ['Mathematics', 'Physics'],
        grades: ['9', '10', '11'],
        bio: 'Experienced mathematics and physics teacher with 10+ years of experience.',
        status: 'APPROVED',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
        },
      },
      { upsert: true, new: true }
    );
    console.log('Teacher 1 created:', teacher1User.email);

    // Create Students
    for (let i = 1; i <= 5; i++) {
      const studentPassword = await bcrypt.hash('student123', 10);
      const studentUser = await User.findOneAndUpdate(
        { email: `student${i}@example.com` },
        {
          email: `student${i}@example.com`,
          password: studentPassword,
          role: 'STUDENT',
          firstName: `Student${i}`,
          lastName: 'Doe',
          isActive: true,
          emailVerified: true,
        },
        { upsert: true, new: true }
      );

      await StudentProfile.findOneAndUpdate(
        { userId: studentUser._id },
        {
          userId: studentUser._id,
          firstName: `Student${i}`,
          lastName: 'Doe',
          grade: '10',
          school: 'Example School',
        },
        { upsert: true, new: true }
      );
      console.log(`Student ${i} created:`, studentUser.email);
    }

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
