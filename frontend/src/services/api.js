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






// Xpair Attribute API
export const getXpairAttributes = async () => {
  const response = await api.get('/xpair-attributes');
  const data = response.data?.data || response.data;

  console.log("getXpairAttributes final data:", data); // Log to double check
  return Array.isArray(data) ? data : [];
};

export const getXpairAttribute = (id) => api.get(`/xpair-attributes/${id}`);
export const createXpairAttribute = (data) => api.post('/xpair-attributes', data);
export const updateXpairAttribute = (id, data) => api.put(`/xpair-attributes/${id}`, data);
export const deleteXpairAttribute = (id) => api.delete(`/xpair-attributes/${id}`);

// For dropdowns
export const getAttributeList = async () => {
  const response = await api.get('/attributes/list'); // correct path
  return response.data;
};

export const getXpairIOList = async () => {
  const response = await api.get('/xpair-io');
  return response.data; // because it's already an array
};

// Optional: If you want to show IO Name with ID
export const getXpairIONames = () => api.get('/xpair-io-name-mapping');

export default api;