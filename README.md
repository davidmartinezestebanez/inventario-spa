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

## 🎨 Características de la Interfaz Visual

El frontend ha sido diseñado con un estilo empresarial moderno utilizando **CSS nativo puro**:
* **Dashboard Analítico**: Tarjetas de métricas automatizadas (Total de Productos, Valor de Inventario y Alertas).
* **Control de Stock Dinámico**: Alertas visuales con badges animados de pulso cuando un producto tiene menos de 5 unidades.
* **Modal de Borrado Premium**: Reemplaza el confirmador del navegador por un modal elegante con fondo difuminado (`backdrop-filter: blur(8px)`) y animación elástica.
* **Buscador en Tiempo Real**: Filtro de coincidencia de texto instantáneo sin recargar la página.
