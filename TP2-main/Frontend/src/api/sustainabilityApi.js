import axiosClient from './axiosClient';

export async function getGreenFrameReport() {
  // axiosClient ya apunta a /api, así que esto pega a GET /api/sustainability
  const res = await axiosClient.get('/sustainability');
  return res.data;
}

