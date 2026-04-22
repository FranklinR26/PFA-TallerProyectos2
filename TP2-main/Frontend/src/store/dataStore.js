import { create } from 'zustand';
import * as api from '../api/dataApi';

export const useDataStore = create((set, get) => ({
  teachers:   [],
  classrooms: [],
  sections:   [],
  courses:    [],
  students:   [],
  loading:    false,
  error:      null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [t, r, sec, co, st] = await Promise.all([
        api.getTeachers(),
        api.getClassrooms(),
        api.getSections(),
        api.getCourses(),
        api.getStudents(),
      ]);
      set({
        teachers:   t.data,
        classrooms: r.data,
        sections:   sec.data,
        courses:    co.data,
        students:   st.data,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  addTeacher: async (data) => {
    const res = await api.createTeacher(data);
    set(s => ({ teachers: [...s.teachers, res.data] }));
    return res.data;
  },
  updateTeacher: async (id, data) => {
    const res = await api.updateTeacher(id, data);
    set(s => ({ teachers: s.teachers.map(t => t._id === id ? res.data : t) }));
  },
  removeTeacher: async (id) => {
    await api.deleteTeacher(id);
    set(s => ({ teachers: s.teachers.filter(t => t._id !== id) }));
  },

  addClassroom: async (data) => {
    const res = await api.createClassroom(data);
    set(s => ({ classrooms: [...s.classrooms, res.data] }));
    return res.data;
  },
  updateClassroom: async (id, data) => {
    const res = await api.updateClassroom(id, data);
    set(s => ({ classrooms: s.classrooms.map(r => r._id === id ? res.data : r) }));
  },
  removeClassroom: async (id) => {
    await api.deleteClassroom(id);
    set(s => ({ classrooms: s.classrooms.filter(r => r._id !== id) }));
  },

  addSection: async (data) => {
    const res = await api.createSection(data);
    set(s => ({ sections: [...s.sections, res.data] }));
    return res.data;
  },
  updateSection: async (id, data) => {
    const res = await api.updateSection(id, data);
    set(s => ({ sections: s.sections.map(x => x._id === id ? res.data : x) }));
  },
  removeSection: async (id) => {
    await api.deleteSection(id);
    set(s => ({ sections: s.sections.filter(x => x._id !== id) }));
  },

  addCourse: async (data) => {
    const res = await api.createCourse(data);
    set(s => ({ courses: [...s.courses, res.data] }));
    return res.data;
  },
  updateCourse: async (id, data) => {
    const res = await api.updateCourse(id, data);
    set(s => ({ courses: s.courses.map(c => c._id === id ? res.data : c) }));
  },
  removeCourse: async (id) => {
    await api.deleteCourse(id);
    set(s => ({ courses: s.courses.filter(c => c._id !== id) }));
  },

  addStudent: async (data) => {
    const res = await api.createStudent(data);
    set(s => ({ students: [...s.students, res.data] }));
    return res.data;
  },
  updateStudent: async (id, data) => {
    const res = await api.updateStudent(id, data);
    set(s => ({ students: s.students.map(x => x._id === id ? res.data : x) }));
  },
  removeStudent: async (id) => {
    await api.deleteStudent(id);
    set(s => ({ students: s.students.filter(x => x._id !== id) }));
  },
  enroll: async (studentId, courseId) => {
    await api.enrollStudent(studentId, courseId);
    await get().fetchAll();
  },
  unenroll: async (studentId, courseId) => {
    await api.unenrollStudent(studentId, courseId);
    await get().fetchAll();
  },
  bulkEnroll: async (sectionId, courseId) => {
    await api.bulkEnroll({ sectionId, courseId });
    await get().fetchAll();
  },
}));
