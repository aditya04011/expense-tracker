import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
    baseURL: 'http://localhost:9003',
});

// Interceptor to add X-Request-Id to all POST requests
api.interceptors.request.use((config) => {
    if (config.method === 'post') {
        config.headers['X-Request-Id'] = uuidv4();
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
