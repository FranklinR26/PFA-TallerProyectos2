import 'dotenv/config';
import mongoose from 'mongoose';
import { User }    from '../models/User.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';

await mongoose.connect(process.env.MONGO_URI);
await User.deleteMany({});

const ana     = await Student.findOne({ code: 'U2025001' });
const jorge   = await Student.findOne({ code: 'U2024016' });
const teacher = await Teacher.findOne({ name: 'Dr. Pérez' });

await User.create([
  {
    code: 'ADMIN01', name: 'Administrador',
    email: 'admin@uni.edu', passwordHash: 'admin123', role: 'admin',
  },
  {
    code: 'COORD01', name: 'Coordinadora Académica',
    email: 'coord@uni.edu', passwordHash: 'coord123', role: 'coordinador',
  },
  {
    code: 'U2025001', name: 'Ana Ramírez',
    email: 'ana@uni.edu', passwordHash: 'est123',
    role: 'estudiante', entityId: ana?._id,
  },
  {
    code: 'U2024016', name: 'Jorge Flores',
    email: 'jorge@uni.edu', passwordHash: 'est123',
    role: 'estudiante', entityId: jorge?._id,
  },
  {
    code: 'DOC01', name: 'Dr. Pérez',
    email: 'docente@uni.edu', passwordHash: 'doc123',
    role: 'docente', entityId: teacher?._id,
  },
]);

console.log('Users seed completo');
await mongoose.disconnect();
