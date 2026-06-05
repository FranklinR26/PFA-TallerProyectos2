import axiosClient from './axiosClient';

export const getSustainabilityReport = () => axiosClient.get('/sustainability');
