import axiosClient from './axiosClient';

export const generateSchedule   = (weights, params) =>
  axiosClient.post('/schedule/generate', { weights, params });

export const getActiveSchedule  = () =>
  axiosClient.get('/schedule/active');

export const getScheduleHistory = () =>
  axiosClient.get('/schedule/history');

export const activateSchedule   = (id) =>
  axiosClient.put(`/schedule/${id}/activate`);

export const getFullSchedule    = () =>
  axiosClient.get('/schedule/full');

export const patchScheduleEntry = (varId, day, slot, roomId) =>
  axiosClient.patch('/schedule/entry', { varId, day, slot, roomId });

export const validateSchedule = () =>
  axiosClient.get('/schedule/validate');
