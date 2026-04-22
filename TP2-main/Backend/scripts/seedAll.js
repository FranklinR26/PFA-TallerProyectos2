/**
 * seedAll.js — Seed completo de HorarioConti
 * Limpia toda la base de datos y recrea:
 *   • 1 admin + 1 coordinador
 *   • 5 docentes  (con disponibilidad horaria y cuenta de usuario)
 *   • 4 aulas teoria + 2 lab + 1 taller + 1 auditorio
 *   • 3 secciones
 *   • 10 cursos distribuidos entre docentes
 *   • 18 estudiantes distribuidos en secciones (con cuenta de usuario)
 *
 * Uso:  node scripts/seedAll.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { User }      from '../models/User.js';
import { Teacher }   from '../models/Teacher.js';
import { Classroom } from '../models/Classroom.js';
import { Section }   from '../models/Section.js';
import { Course }    from '../models/Course.js';
import { Student }   from '../models/Student.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('✔ Conectado a MongoDB');

/* ── 1. Limpiar todo ──────────────────────────────────────────────────────── */
await Promise.all([
  User.deleteMany({}),
  Teacher.deleteMany({}),
  Classroom.deleteMany({}),
  Section.deleteMany({}),
  Course.deleteMany({}),
  Student.deleteMany({}),
]);
console.log('✔ Colecciones vaciadas');

/* ── 2. Helper de disponibilidad ──────────────────────────────────────────── */
// días 0-4 = Lun-Vie  |  slots 0-11 = 08:00-19:00
// 0 = no disponible, 1 = disponible, 2 = preferido
const avail = (off = [], pref = []) => {
  const g = Array.from({ length: 5 }, () => Array(12).fill(1));
  off.forEach(([d, s])  => (g[d][s] = 0));
  pref.forEach(([d, s]) => (g[d][s] = 2));
  return g;
};

/* ── 3. Docentes ──────────────────────────────────────────────────────────── */
const teachers = await Teacher.create([
  {
    name:  'Dr. Carlos Pérez Mendoza',
    email: 'cperez@uni.edu',
    // Libre mañanas Lun-Mié, prefiere 10-12
    availability: avail(
      [[3,8],[3,9],[3,10],[3,11],[4,8],[4,9],[4,10],[4,11]],
      [[0,2],[0,3],[1,2],[1,3],[2,2],[2,3]]
    ),
  },
  {
    name:  'Mg. Rosa Rojas Llanos',
    email: 'rrojas@uni.edu',
    // Prefiere tardes
    availability: avail(
      [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]],
      [[0,4],[0,5],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]]
    ),
  },
  {
    name:  'Ing. Luis Vega Torres',
    email: 'lvega@uni.edu',
    // No viernes tarde, prefiere mañanas Jue-Vie
    availability: avail(
      [[4,6],[4,7],[4,8],[4,9],[4,10],[4,11]],
      [[3,0],[3,1],[3,2],[4,0],[4,1],[4,2]]
    ),
  },
  {
    name:  'Dra. María Luna Chávez',
    email: 'mluna@uni.edu',
    // Solo Lun-Jue, prefiere horario central
    availability: avail(
      [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[4,10],[4,11]],
      [[0,3],[0,4],[1,3],[1,4],[2,3],[2,4],[3,3],[3,4]]
    ),
  },
  {
    name:  'Mg. Juan Quispe Huamán',
    email: 'jquispe@uni.edu',
    // Disponible toda la semana, prefiere mañanas
    availability: avail(
      [],
      [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0],[4,1]]
    ),
  },
]);
const [t1, t2, t3, t4, t5] = teachers;
console.log(`✔ ${teachers.length} docentes creados`);

/* ── 4. Aulas ─────────────────────────────────────────────────────────────── */
const classrooms = await Classroom.create([
  { name: 'Aula A-101',       type: 'teoria',    capacity: 45 },
  { name: 'Aula A-102',       type: 'teoria',    capacity: 40 },
  { name: 'Aula B-201',       type: 'teoria',    capacity: 38 },
  { name: 'Aula B-202',       type: 'teoria',    capacity: 35 },
  { name: 'Lab Cómputo 1',    type: 'lab',       capacity: 30 },
  { name: 'Lab Cómputo 2',    type: 'lab',       capacity: 28 },
  { name: 'Taller Proyectos', type: 'taller',    capacity: 25 },
  { name: 'Auditorio Central',type: 'auditorio', capacity: 120 },
]);
console.log(`✔ ${classrooms.length} aulas creadas`);

/* ── 5. Secciones ─────────────────────────────────────────────────────────── */
const [sec1, sec2, sec3] = await Section.create([
  { name: 'Ing. Sistemas — III-A', students: 30 },
  { name: 'Ing. Sistemas — III-B', students: 28 },
  { name: 'Ing. Sistemas — V-A',   students: 22 },
]);
console.log('✔ 3 secciones creadas');

/* ── 6. Cursos ────────────────────────────────────────────────────────────── */
const courses = await Course.create([
  // Ciclo III-A
  { name: 'Matemática Discreta',       teacher: t1._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'teoria', capacity: 40 },
  { name: 'Programación Orientada a Objetos', teacher: t2._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'lab',    capacity: 28 },
  { name: 'Base de Datos I',           teacher: t3._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'lab',    capacity: 28 },
  { name: 'Estadística Aplicada',      teacher: t4._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'teoria', capacity: 38 },
  // Ciclo III-B
  { name: 'Algoritmos y Estructuras',  teacher: t2._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'lab',    capacity: 28 },
  { name: 'Cálculo Multivariable',     teacher: t1._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'teoria', capacity: 38 },
  // Ciclo V-A
  { name: 'Redes de Computadoras',     teacher: t3._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'lab',    capacity: 25 },
  { name: 'Ingeniería de Software',    teacher: t5._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'taller', capacity: 22 },
  { name: 'Inteligencia Artificial',   teacher: t4._id, sessionsPerWeek: 2, blocksPerSession: 2, roomType: 'lab',    capacity: 25 },
  { name: 'Ética y Responsabilidad',   teacher: t5._id, sessionsPerWeek: 1, blocksPerSession: 2, roomType: 'teoria', capacity: 45 },
]);
const [co1, co2, co3, co4, co5, co6, co7, co8, co9, co10] = courses;
console.log(`✔ ${courses.length} cursos creados`);

/* ── 7. Estudiantes ───────────────────────────────────────────────────────── */
// Los estudiantes se crean SIN cursos pre-matriculados.
// Cada uno se matricula por su cuenta desde el Portal del Estudiante.
const studentDefs = [
  // Sección III-A
  { code: 'U20230101', name: 'Ana Lucía Ramírez Torres',    section: sec1._id, email: 'ana@uni.edu',       password: 'est123' },
  { code: 'U20230102', name: 'Bruno Andrés Castillo Vera',  section: sec1._id, email: 'bcastillo@uni.edu', password: 'est123' },
  { code: 'U20230103', name: 'Carla Sofía Huamán Díaz',     section: sec1._id, email: 'chuaman@uni.edu',   password: 'est123' },
  { code: 'U20230104', name: 'Diego Alonso Salas Paredes',  section: sec1._id, email: 'dsalas@uni.edu',    password: 'est123' },
  { code: 'U20230105', name: 'Elena Patricia Quispe Cruz',  section: sec1._id, email: 'equispe@uni.edu',   password: 'est123' },
  { code: 'U20230106', name: 'Fernando José Neyra Llanos',  section: sec1._id, email: 'fneyra@uni.edu',    password: 'est123' },
  // Sección III-B
  { code: 'U20230201', name: 'Gabriela Renata Chávez Ríos', section: sec2._id, email: 'gchavez@uni.edu',   password: 'est123' },
  { code: 'U20230202', name: 'Hugo Martín Aliaga Flores',   section: sec2._id, email: 'haliaga@uni.edu',   password: 'est123' },
  { code: 'U20230203', name: 'Inés Valeria Paredes Coello', section: sec2._id, email: 'iparedes@uni.edu',  password: 'est123' },
  { code: 'U20230204', name: 'Jorge Luis Flores Mendoza',   section: sec2._id, email: 'jflores@uni.edu',   password: 'est123' },
  { code: 'U20230205', name: 'Karla Milagros Ruiz Taipe',   section: sec2._id, email: 'kruiz@uni.edu',     password: 'est123' },
  { code: 'U20230206', name: 'Leonardo Fabio Mora Cáceres', section: sec2._id, email: 'lmora@uni.edu',     password: 'est123' },
  // Sección V-A
  { code: 'U20210301', name: 'María Fernanda Lozano Reyes', section: sec3._id, email: 'mlozano@uni.edu',   password: 'est123' },
  { code: 'U20210302', name: 'Nicolás Rodrigo Vargas Pinto',section: sec3._id, email: 'nvargas@uni.edu',   password: 'est123' },
  { code: 'U20210303', name: 'Óscar Renato Medina Solís',   section: sec3._id, email: 'omedina@uni.edu',   password: 'est123' },
  { code: 'U20210304', name: 'Paula Andrea Contreras Vela', section: sec3._id, email: 'pcontreras@uni.edu',password: 'est123' },
  { code: 'U20210305', name: 'Raúl Andrés Espinoza Tapia',  section: sec3._id, email: 'respinoza@uni.edu', password: 'est123' },
  { code: 'U20210306', name: 'Sandra Luz Torres Huanca',    section: sec3._id, email: 'storres@uni.edu',   password: 'est123' },
];

// Crear Student + User para cada estudiante
const studentUsers = [];
for (const def of studentDefs) {
  const { email, password, ...studentData } = def;
  const student = await Student.create({ ...studentData, courses: [] });
  studentUsers.push({
    code: student.code, name: student.name,
    email, passwordHash: password,
    role: 'estudiante', entityId: student._id,
  });
}
console.log(`✔ ${studentDefs.length} estudiantes creados`);

/* ── 8. Usuarios de docentes ─────────────────────────────────────────────── */
const teacherUsers = teachers.map(t => ({
  code: t._id.toString().slice(-6).toUpperCase(),
  name: t.name,
  email: t.email,
  passwordHash: 'doc123',
  role: 'docente',
  entityId: t._id,
}));

/* ── 9. Todos los usuarios ────────────────────────────────────────────────── */
await User.create([
  // Administrativos
  {
    code: 'ADMIN01', name: 'Administrador del Sistema',
    email: 'admin@uni.edu', passwordHash: 'admin123', role: 'admin',
  },
  {
    code: 'COORD01', name: 'Coordinadora Académica',
    email: 'coord@uni.edu', passwordHash: 'coord123', role: 'coordinador',
  },
  // Docentes
  ...teacherUsers,
  // Estudiantes
  ...studentUsers,
]);
console.log(`✔ ${2 + teacherUsers.length + studentUsers.length} usuarios creados`);

/* ── Resumen ──────────────────────────────────────────────────────────────── */
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  SEED COMPLETADO');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Admin        admin@uni.edu      / admin123');
console.log('  Coordinador  coord@uni.edu      / coord123');
console.log('  Docentes     [nombre]@uni.edu   / doc123');
console.log('               cperez / rrojas / lvega / mluna / jquispe');
console.log('  Estudiantes  [codigo]@uni.edu   / est123');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

await mongoose.disconnect();
