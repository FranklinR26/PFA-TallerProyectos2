import axiosClient from './axiosClient';

export const getPeriods      = ()     => axiosClient.get('/periods');
export const createPeriod    = (data) => axiosClient.post('/periods', data);
export const activatePeriod  = (id)   => axiosClient.put(`/periods/${id}/activate`);
export const deletePeriod    = (id)   => axiosClient.delete(`/periods/${id}`);
