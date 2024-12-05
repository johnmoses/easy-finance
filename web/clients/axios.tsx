import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apixClient = axios.create({
  baseURL: process.env.APIX_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});
