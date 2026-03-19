import axios from "axios";
import type { Application } from "../types";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor: agrega el token JWT en cada request automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

// Interceptor: si el servidor devuelve 401, limpia la sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); //usuario deslogueado
      localStorage.removeItem('user'); //Se elimina la información del usuario guardada.
      window.location.href = '/login';
    }
    return Promise.reject(error); //Esto vuelve a lanzar el error para que el código que hizo la request pueda manejarlo también.
  }
);

//Auth
export const authService = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

//Postulaciones
export const applicationsService = {
    getAll: () => api.get('/applications'),
    getById: (id: number) => api.get(`/applications/${id}`),
    create: (data: Partial<Application>) => api.post('/applications', data), //Partial convierte todas las propiedades de un tipo en opcionales
    update: (id: number, data: Partial<Application>) => api.put(`/applications/${id}`, data),
    delete: (id: number) => api.delete(`/applications/${id}`),
  };

  export default api



