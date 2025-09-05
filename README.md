# 🏠 Sistema de Gestión Inmobiliaria - Frontend



## ✨ Características

- **🏡 Gestión Completa de Inmuebles**: Crear, visualizar, editar y eliminar propiedades
- **🔍 Sistema de Filtros Avanzado**: Búsqueda por ubicación, ciudad, tipo, precio, habitaciones y más
- **📸 Galería de Imágenes**: Upload y gestión de múltiples imágenes por propiedad
- **💰 Tipos de Consignación**: Soporte para venta y arriendo
- **📱 Diseño Responsivo**: Interfaz adaptable a dispositivos móviles y desktop
- **🎨 UI Moderna**: Interfaz elegante con Ant Design y Tailwind CSS

## 🛠️ Tecnologías Utilizadas

### Core
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM** - Navegación y enrutamiento
- **Axios** - Cliente HTTP para comunicación con API

### UI/UX
- **Ant Design** - Biblioteca de componentes UI
- **Tailwind CSS** - Framework de CSS utilitario
- **Ant Design Icons** - Iconografía

### Funcionalidades
- **Upload de Archivos** - Gestión de imágenes
- **Formularios Dinámicos** - Validación y manejo de datos
- **Estado Local** - Gestión con React Hooks

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Backend Laravel corriendo en puerto 8000

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/jdflorez480/inmobiliaria_front.git
   cd inmobiliaria_front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── InmueblesList.js     # Lista principal con filtros
│   ├── InmuebleDetalle.js   # Vista detalle de propiedad
│   └── CrearInmuebleModal.js # Modal para crear/editar
├── api.js               # Funciones de comunicación con backend
├── App.js               # Componente principal con rutas
├── App.css              # Estilos globales
└── index.js             # Punto de entrada
```

## 🔧 Funcionalidades Principales

### 📋 Lista de Inmuebles
- Visualización en tarjetas responsivas
- Filtros por ubicación, ciudad, tipo, precio
- Paginación y búsqueda en tiempo real
- Acciones CRUD directas desde la lista

### 🏠 Detalle de Inmueble
- Galería de imágenes con navegación
- Información completa de la propiedad
- Características y amenidades
- Precios según tipo de consignación

### ✏️ Gestión de Propiedades
- Modal unificado para crear y editar
- Upload múltiple de imágenes
- Validación de formularios
- Soporte para todos los campos del backend

### 🖼️ Gestión de Imágenes
- Upload con preview inmediato
- Eliminación individual de imágenes
- Soporte para múltiples formatos
- Integración con storage del backend

## 🌐 API Integration

El frontend se comunica con una API Laravel que proporciona:

### Endpoints Principales
- `GET /api/inmuebles` - Lista con filtros
- `POST /api/inmuebles` - Crear nuevo inmueble
- `PUT /api/inmuebles/{id}` - Actualizar inmueble
- `DELETE /api/inmuebles/{id}` - Eliminar inmueble
- `DELETE /api/inmuebles/{id}/imagenes/{imagen_id}` - Eliminar imagen

### Parámetros de Filtros
- `busqueda` - Búsqueda en título, descripción y ubicación
- `ciudad` - Filtro por ciudad específica
- `tipo_consignacion` - venta/arriendo
- `precio_min`, `precio_max` - Rango de precios
- `habitaciones`, `banos` - Número mínimo
- `piscina`, `ascensor`, `parqueadero` - Amenidades

## 🎨 Diseño y UI

### Paleta de Colores
- **Primario**: Azul (#1890ff)
- **Secundario**: Verde (#52c41a)
- **Neutros**: Grises para texto y fondos
- **Estados**: Rojo para eliminación, amarillo para edición

### Componentes Clave
- **Cards**: Presentación de inmuebles
- **Modals**: Formularios de creación/edición
- **Filters**: Barra de búsqueda avanzada
- **Gallery**: Visualización de imágenes

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños
- **Touch Friendly**: Botones y controles táctiles
- **Performance**: Carga optimizada de imágenes

## 🔒 Validaciones

### Frontend
- Campos requeridos marcados claramente
- Validación de formatos de archivo
- Límites de tamaño para imágenes
- Feedback visual inmediato

### Backend Integration
- Manejo de errores de validación del servidor
- Mensajes de error específicos por campo
- Estados de carga durante operaciones

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start          # Servidor de desarrollo

# Construcción
npm run build      # Build para producción

# Testing
npm test           # Ejecutar tests

# Análisis
npm run eject      # Exponer configuración (irreversible)
```
