import axios from 'axios';

const api = axios.create({
   baseURL: 'http://{yourIpHere}:3333',
});

export default api;
