import 'dotenv/config';
import mongoose from 'mongoose';
import { Teacher }   from '../models/Teacher.js';
import { Classroom } from '../models/Classroom.js';
import { Section }   from '../models/Section.js';
import { Course }    from '../models/Course.js';
import { Student }   from '../models/Student.js';

await mongoose.connect(process.env.MONGO_URI);

await Promise.all([
  Teacher.deleteMany({}),
  Classroom.deleteMany({}),
  Section.deleteMany({}),
  Course.deleteMany({}),
  Student.deleteMany({}),
]);

const mkAvail = (unavailable = [], preferred = []) => {
  const av = Array.from({ length: 5 }, () => Array(12).fill(1));
  unavailable.forEach(([d, s]) => (av[d][s] = 0));
  preferred.forEach(([d, s]) => (av[d][s] = 2));
  return av;
};

const [t1, t2, t3, t4] = await Teacher.create([
  { name: 'Dr. Pérez',  availability: mkAvail([[0,0],[0,1],[4,10],[4,11]], [[1,2],[1,3],[2,2]]) },
  { name: 'Mg. Rojas',  availability: mkAvail([[2,0],[2,1],[2,2]],         [[0,4],[0,5],[3,4]]) },
  { name: 'Ing. Vega',  availability: mkAvail([[4,8],[4,9],[4,10],[4,11]], [[0,2],[0,3],[1,2]]) },
  { name: 'Dra. Luna',  availability: mkAvail([[0,10],[0,11],[1,10]],      [[2,1],[2,2],[3,1]]) },
]);

const [r1, r2, r3, r4] = await Classroom.create([
  { name: 'Aula 101',    type: 'teoria', capacity: 40 },
  { name: 'Aula 102',    type: 'teoria', capacity: 35 },
  { name: 'Lab Cómputo', type: 'lab',    capacity: 30 },
  { name: 'Lab Redes',   type: 'lab',    capacity: 25 },
]);

const [s1, s2] = await Section.create([
  { name: 'Ing. Sistemas III', students: 28 },
  { name: 'Ing. Sistemas V',   students: 22 },
]);

const [co1,co2,co3,co4,co5,co6,co7,co8] = await Course.create([
  { name: 'Matemática Discreta',   teacher: t1._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'teoria', capacity:35 },
  { name: 'Programación II',       teacher: t2._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'lab',    capacity:25 },
  { name: 'Base de Datos I',       teacher: t3._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'lab',    capacity:25 },
  { name: 'Estadística',           teacher: t4._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'teoria', capacity:35 },
  { name: 'Redes de Computadoras', teacher: t3._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'lab',    capacity:20 },
  { name: 'Ing. de Software',      teacher: t1._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'teoria', capacity:30 },
  { name: 'IA y ML',               teacher: t2._id, sessionsPerWeek:2, blocksPerSession:2, roomType:'lab',    capacity:25 },
  { name: 'Ética Profesional',     teacher: t4._id, sessionsPerWeek:1, blocksPerSession:2, roomType:'teoria', capacity:40 },
]);

const s1Base = [co1._id, co2._id, co3._id, co4._id];
const s2Base = [co5._id, co6._id, co7._id, co8._id];

await Student.create([
  { code:'U2025001', name:'Ana Ramírez',      section:s1._id, courses:[...s1Base] },
  { code:'U2025002', name:'Bruno Castillo',   section:s1._id, courses:[...s1Base] },
  { code:'U2025003', name:'Carla Huamán',     section:s1._id, courses:[...s1Base] },
  { code:'U2025004', name:'Diego Salas',      section:s1._id, courses:[...s1Base] },
  { code:'U2025005', name:'Elena Quispe',     section:s1._id, courses:[...s1Base] },
  { code:'U2024015', name:'Inés Paredes',     section:s2._id, courses:[...s2Base] },
  { code:'U2024016', name:'Jorge Flores',     section:s2._id, courses:[...s2Base] },
  { code:'U2024017', name:'Karla Aliaga',     section:s2._id, courses:[...s2Base] },
  { code:'U2024099', name:'Óscar Repetidor',  section:s2._id, courses:[co5._id,co6._id,co3._id,co4._id] },
  { code:'U2025050', name:'Paula Adelantada', section:s1._id, courses:[...s1Base, co7._id] },
  { code:'U2023030', name:'Raúl Especial',    section:null,   courses:[co2._id,co5._id,co8._id] },
]);

console.log('Seed completo');
await mongoose.disconnect();
