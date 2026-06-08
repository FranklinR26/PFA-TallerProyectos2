import axiosClient from './axiosClient';

export async function getEnvironmentalImpact({ limit = 200 } = {}) {
  const res = await axiosClient.get('/environmental-impact', { params: { limit } });
  return res.data;
}

