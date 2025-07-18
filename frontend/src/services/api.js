import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if your backend is hosted elsewhere
});

// Attributes API
export const getAttributes = async () => {
  try {
    const response = await api.get('/attributes');
    console.log('Raw response:', response);
    
    // Handle different response structures
    const responseData = response.data?.data || response.data;
    
    if (!responseData) {
      throw new Error('No data received from API');
    }
    
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};


export const getAttribute = (id) => api.get(`/attributes/${id}`);
export const createAttribute = (data) => api.post('/attributes', data);
export const updateAttribute = (id, data) => api.put(`/attributes/${id}`, data);
export const deleteAttribute = (id) => api.delete(`/attributes/${id}`);

export default api;