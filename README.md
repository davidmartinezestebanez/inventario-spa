# 🚀 Sistema Profesional de Gestión de Inventario Full Stack (SPA)

Bienvenido a este proyecto Full Stack diseñado con una **arquitectura de Aplicación de Una Sola Página (SPA) desacoplada**. Es la base ideal para aprender o enseñar en un videotutorial cómo conectar un frontend moderno en **React** con un backend robusto en **Node.js + Express** mediante una **API REST**.

---

## 🏛️ Arquitectura Desacoplada SPA

En esta arquitectura, el **Frontend** y el **Backend** están completamente separados (desacoplados):

```text
┌──────────────────────────────┐              ┌──────────────────────────────┐
│     FRONTEND (React + Vite)  │  peticiones  │    BACKEND (Node + Express)  │
│    http://localhost:5173     ├─────────────>│    http://localhost:5000     │
│   (Renderiza la interfaz)    │<─────────────┤     (Procesa los datos)      │
└──────────────────────────────┘  respuestas  └──────────────────────────────┘
                                    (JSON)
```

### ¿Cómo se comunican?
1. **Peticiones HTTP**: El cliente (React) utiliza la API nativa de JavaScript `fetch()` para comunicarse con los diferentes endpoints del backend (GET, POST, PUT, DELETE).
2. **Intercambio JSON**: Todas las peticiones envían y reciben datos en formato estándar JSON.
3. **CORS (Cross-Origin Resource Sharing)**: Como el frontend corre en el puerto `5173` y el backend en el puerto `5000`, el navegador bloquearía la comunicación por seguridad. Por ello, el backend tiene habilitado el middleware de `cors` para permitir el acceso cruzado seguro.
4. **Manejo del Estado**: React almacena la información de los productos en su estado local (`useState`). Cuando se realiza un cambio (ej. borrar un producto), se envía la petición al backend y, al recibir una respuesta de éxito, React actualiza su estado inmutablemente para refrescar la pantalla en milisegundos sin recargar toda la página.

---

## 📂 Estructura del Código

* 📁 **`backend/`**
  * `package.json`: Dependencias (`express`, `cors`, `nodemon`).
  * `server.js`: Código del servidor, array de productos en memoria y endpoints CRUD.
* 📁 **`frontend/`**
  * `package.json`: Dependencias (`react`, `react-dom`, `vite`).
  * `index.html`: Estructura HTML que carga la tipografía premium *Outfit* desde Google Fonts.
  * `src/main.jsx`: Punto de inicio de React.
  * `src/App.jsx`: Dashboard principal con lógica CRUD, llamadas `fetch` y tarjetas KPI.
  * `src/index.css`: Hoja de estilos moderna (colores HSL refinados, sombras 3D y animaciones).

---

## ⚙️ Instrucciones de Ejecución

Para iniciar la aplicación en tu computadora local:

### 1. Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (incluye `npm`).

### 2. Configurar y Ejecutar el Backend
Abre una terminal en la carpeta `backend`:
```bash
cd backend
npm install
npm run dev
```
*El servidor API REST estará disponible en: [http://localhost:5000](http://localhost:5000)*

### 3. Configurar y Ejecutar el Frontend
Abre otra terminal diferente en la carpeta `frontend`:
```bash
cd frontend
npm install
npm run dev
```
*El cliente React estará disponible en: [http://localhost:5173](http://localhost:5173)*

---

## 🎬 Guion Recomendado para tu Videotutorial (5-7 Minutos)

Este proyecto fue optimizado para que puedas grabarlo y explicarlo fluidamente de forma muy didáctica:

| Tiempo | Sección | Qué Explicar y Enseñar |
| :--- | :--- | :--- |
| **0:00 - 1:00** | **Introducción e Interfaz** | Muestra el Dashboard funcionando. Añade un producto, edita uno existente y bórralo en tiempo real. Señala cómo cambia dinámicamente la tarjeta de **Stock Bajo** en base a las existencias (< 5). Explica el concepto de SPA desacoplada. |
| **1:00 - 2:30** | **El Servidor Express (`server.js`)** | Abre `backend/server.js`. Explica de forma concisa el middleware `cors()`, el almacenamiento temporal en el array `productos` y cómo los endpoints `GET`, `POST`, `PUT`, `DELETE` manipulan dicho array y retornan JSON. |
| **2:30 - 4:00** | **El Estado en React (`App.jsx`)** | Pasa al frontend en `App.jsx`. Muestra el gancho `useState` para almacenar productos y saber si estamos editando. Explica cómo `useEffect` hace el `fetch` inicial al montar el componente para traer los datos del servidor. |
| **4:00 - 5:30** | **Operaciones CRUD (`App.jsx`)** | Enseña la función `handleSubmit`. Explica cómo envía peticiones `POST` (nuevo) o `PUT` (edición) serializando el objeto a JSON y cómo actualiza el estado local de forma inmutable usando `[...productos, nuevoProducto]` o `.map()`. Enseña la función `handleEliminar` y su `.filter()`. |
| **5:30 - 6:30** | **Diseño y Reactividad Visual** | Muestra brevemente la hoja `index.css` enfocándote en las variables de color y los efectos. En `App.jsx`, destaca el renderizado condicional de las clases del stock (`healthy`, `warning`, `danger`) que crea las animaciones de alerta en la tabla. |
| **6:30 - 7:00** | **Conclusión** | Cierra animando a los espectadores a clonar el proyecto, experimentar con él y expandir el sistema a una base de datos real. |
