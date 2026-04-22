import axiosClient from './axiosClient';

export const loginRequest = (email, password) =>
  axiosClient.post('/auth/login', { email, password });

export const getMeRequest = () =>
  axiosClient.get('/auth/me');

export const registerRequest = (data) =>
  axiosClient.post('/auth/register', data);
