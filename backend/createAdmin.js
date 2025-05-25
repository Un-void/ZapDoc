import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = 'adm@example.com'; 
  const password = 'Admin@123';     

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new User({
    name: 'Admin',
    email,
    password: hashedPassword,
    role: 'admin',
  });

  await admin.save();
  console.log('Admin user created successfully!');
  process.exit();
};

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});