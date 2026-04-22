import axiosClient from './axiosClient';

export const getTeachers    = ()         => axiosClient.get('/data/teachers');
export const createTeacher  = (data)     => axiosClient.post('/data/teachers', data);
export const updateTeacher  = (id, data) => axiosClient.put(`/data/teachers/${id}`, data);
export const deleteTeacher  = (id)       => axiosClient.delete(`/data/teachers/${id}`);

export const getClassrooms   = ()         => axiosClient.get('/data/classrooms');
export const createClassroom = (data)     => axiosClient.post('/data/classrooms', data);
export const updateClassroom = (id, data) => axiosClient.put(`/data/classrooms/${id}`, data);
export const deleteClassroom = (id)       => axiosClient.delete(`/data/classrooms/${id}`);

export const getSections    = ()         => axiosClient.get('/data/sections');
export const createSection  = (data)     => axiosClient.post('/data/sections', data);
export const updateSection  = (id, data) => axiosClient.put(`/data/sections/${id}`, data);
export const deleteSection  = (id)       => axiosClient.delete(`/data/sections/${id}`);

export const getCourses    = ()         => axiosClient.get('/data/courses');
export const createCourse  = (data)     => axiosClient.post('/data/courses', data);
export const updateCourse  = (id, data) => axiosClient.put(`/data/courses/${id}`, data);
export const deleteCourse  = (id)       => axiosClient.delete(`/data/courses/${id}`);

export const getStudents    = ()         => axiosClient.get('/data/students');
export const createStudent  = (data)     => axiosClient.post('/data/students', data);
export const updateStudent  = (id, data) => axiosClient.put(`/data/students/${id}`, data);
export const deleteStudent  = (id)       => axiosClient.delete(`/data/students/${id}`);

export const enrollStudent   = (sId, cId) => axiosClient.post(`/data/enroll/${sId}/${cId}`);
export const unenrollStudent = (sId, cId) => axiosClient.delete(`/data/enroll/${sId}/${cId}`);
export const bulkEnroll      = (data)     => axiosClient.post('/data/enroll/bulk', data);
