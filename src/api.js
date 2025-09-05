import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Validar API
export const validarApi = () => api.get('/');

// Listar inmuebles con filtros
export const listarInmuebles = (params = {}) => api.get('/inmuebles', { params });

// Ver detalle de inmueble
export const obtenerInmueble = (id) => api.get(`/inmuebles/${id}`);

// Crear inmueble
export const crearInmueble = (data) => {
  if (data instanceof FormData) {
    // Si es FormData (con imágenes), usar multipart/form-data
    return api.post('/inmuebles', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.post('/inmuebles', data);
};

// Editar inmueble
export const editarInmueble = (id, data) => {
  if (data instanceof FormData) {
    // Si es FormData (con imágenes), usar POST con _method=PUT para simular PUT
    data.append('_method', 'PUT');
    return api.post(`/inmuebles/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return api.put(`/inmuebles/${id}`, data);
};

// Eliminar inmueble
export const eliminarInmueble = (id) => api.delete(`/inmuebles/${id}`);

// Eliminar imagen específica
export const eliminarImagen = (inmuebleId, imagenId) => api.delete(`/inmuebles/${inmuebleId}/imagenes/${imagenId}`);

// Obtener ciudades
export const obtenerCiudades = () => api.get('/ciudades');

export default api;
