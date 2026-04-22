import axiosClient from './axiosClient';

export const getPortalData      = ()             => axiosClient.get('/portal');
export const saveAvailability   = (availability) => axiosClient.put('/portal/availability', { availability });
export const enrollCourse       = (courseId)     => axiosClient.post(`/portal/enroll/${courseId}`);
export const unenrollCourse     = (courseId)     => axiosClient.delete(`/portal/enroll/${courseId}`);
export const joinWaitlist       = (courseId)     => axiosClient.post(`/portal/waitlist/${courseId}`);
export const leaveWaitlist      = (courseId)     => axiosClient.delete(`/portal/waitlist/${courseId}`);
