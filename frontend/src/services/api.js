import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // ajuste se sua porta for diferente
});

export default api;
