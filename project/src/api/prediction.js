import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const predictIrregularity = async (data) => {
  try {
    const response = await apiClient.post('/predict', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Prediction failed');
    } else if (error.request) {
      throw new Error('Unable to connect to the prediction server. Please ensure the backend is running.');
    } else {
      throw new Error('An error occurred while making the prediction');
    }
  }
};

export const updateApiBaseUrl = (newUrl) => {
  apiClient.defaults.baseURL = newUrl;
};

export default apiClient;
