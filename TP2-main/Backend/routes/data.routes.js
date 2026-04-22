import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole }   from '../middleware/checkRole.js';
import {
  getTeachers, createTeacher, updateTeacher, deleteTeacher,
  getClassrooms, createClassroom, updateClassroom, deleteClassroom,
  getSections, createSection, updateSection, deleteSection,
  getCourses, createCourse, updateCourse, deleteCourse,
  getStudents, createStudent, updateStudent, deleteStudent,
  enrollStudent, unenrollStudent, bulkEnroll,
} from '../controllers/data.controller.js';

const router = Router();

router.use(verifyToken);

const adminCoord = checkRole('admin', 'coordinador');

router.get   ('/teachers',     getTeachers);
router.post  ('/teachers',     adminCoord, createTeacher);
router.put   ('/teachers/:id', adminCoord, updateTeacher);
router.delete('/teachers/:id', adminCoord, deleteTeacher);

router.get   ('/classrooms',     getClassrooms);
router.post  ('/classrooms',     adminCoord, createClassroom);
router.put   ('/classrooms/:id', adminCoord, updateClassroom);
router.delete('/classrooms/:id', adminCoord, deleteClassroom);

router.get   ('/sections',     getSections);
router.post  ('/sections',     adminCoord, createSection);
router.put   ('/sections/:id', adminCoord, updateSection);
router.delete('/sections/:id', adminCoord, deleteSection);

router.get   ('/courses',     getCourses);
router.post  ('/courses',     adminCoord, createCourse);
router.put   ('/courses/:id', adminCoord, updateCourse);
router.delete('/courses/:id', adminCoord, deleteCourse);

router.get   ('/students',     adminCoord, getStudents);
router.post  ('/students',     adminCoord, createStudent);
router.put   ('/students/:id', adminCoord, updateStudent);
router.delete('/students/:id', adminCoord, deleteStudent);

// La ruta bulk debe ir antes de /:studentId/:courseId para no colisionar
router.post  ('/enroll/bulk',                  adminCoord, bulkEnroll);
router.post  ('/enroll/:studentId/:courseId',  adminCoord, enrollStudent);
router.delete('/enroll/:studentId/:courseId',  adminCoord, unenrollStudent);

export default router;
