import axiosClient from './axiosClient';

export const getMetrics = () => axiosClient.get('/metrics');
