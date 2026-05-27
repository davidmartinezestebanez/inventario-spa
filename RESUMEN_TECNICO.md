# 🔬 Resumen Técnico del Proyecto: Sistema de Gestión de Inventario SPA

Este documento recopila la documentación técnica formal del proyecto, detallando la arquitectura de software, los flujos de comunicación y los patrones de diseño aplicados. Es ideal para adjuntar al repositorio de GitHub o para responder a preguntas teóricas del tribunal del curso.

---

## 🏛️ 1. Patrón Arquitectónico: SPA Desacoplada

El sistema implementa una **Arquitectura Desacoplada** estructurada bajo el patrón de **Aplicación de Una Sola Página (Single Page Application - SPA)**. 

### Características del desacoplamiento:
* **Separación de Responsabilidades (SoC)**: El servidor no se encarga de estructurar ni renderizar vistas HTML dinámicas (se elimina el uso de motores de plantillas tradicionales como EJS o Pug). Su única responsabilidad es procesar lógica de negocio y servir datos serializados.
* **Autonomía del Cliente**: El cliente (React) se compila, empaqueta e inicia en un servidor de desarrollo estático independiente (`http://localhost:5173`). Se encarga de controlar el ciclo de vida del DOM y actualizar la interfaz dinámicamente basándose en cambios de estado.
* **API REST**: La comunicación se realiza exclusivamente mediante llamadas HTTP sin estado (stateless) que transportan datos estructurados en formato **JSON**.

---

## 📡 2. Esquema de Comunicación y Seguridad (CORS)

Dado que las dos piezas residen en diferentes dominios/puertos de la máquina local, el navegador restringe las llamadas cruzadas por seguridad mediante la política **SOP (Same-Origin Policy)**.

Para permitir que el cliente consulte al servidor:
1. El backend de Node.js implementa el middleware `cors()`.
2. El servidor responde a la petición preliminar de tipo **Preflight** (`OPTIONS`) indicando que el origen `http://localhost:5173` está autorizado y que se permiten los métodos `GET`, `POST`, `PUT` y `DELETE`.

```text
  React Client (Port 5173)                   Express REST API (Port 5000)
    │                                              │
    │ ─── 1. HTTP GET /productos ────────────────> │
    │ <─── 2. Response: JSON Array (Status 200) ── │
    │                                              │
    │ ─── 3. HTTP POST /productos ───────────────> │
    │ <─── 4. Response: Created JSON (Status 201)  │
    │                                              │
```

---

## 💾 3. Diseño del Backend y RESTful Endpoints

El backend está desarrollado utilizando **Node.js** con el microframework **Express**. Para asegurar simplicidad y rapidez, la base de datos se implementa mediante un array de objetos JSON almacenado de forma efímera en la memoria RAM del servidor.

### Estructura de Datos (Esquema de Producto):
```json
{
  "id": "Number (Único y autoincremental)",
  "nombre": "String (Nombre comercial del producto)",
  "categoria": "String (Categoría de ordenación: Tecnología, Oficina...)",
  "precio": "Number (Valor unitario de venta)",
  "stock": "Number (Existencias actuales en el almacén)"
}
```

### Tabla de Endpoints de la API REST:
| Método | Endpoint | Acción / Descripción | Respuesta Exitosa |
| :--- | :--- | :--- | :--- |
| **GET** | `/productos` | Retorna el listado completo de productos en el almacén. | `200 OK` (JSON Array) |
| **POST** | `/productos` | Recibe los datos validados e inserta un nuevo producto. | `201 Created` (Nuevo Producto JSON) |
| **PUT** | `/productos/:id` | Recibe el ID por parámetro y actualiza de manera parcial o total. | `200 OK` (Producto Actualizado JSON) |
| **DELETE**| `/productos/:id` | Elimina el elemento coincidente y limpia la lista. | `200 OK` (Mensaje de Éxito JSON) |

---

## ⚛️ 4. Frontend: Gestión de Estados y Efectos

El frontend está desarrollado sobre **React 18** utilizando el empaquetador **Vite** para optimizar los tiempos de compilación.

### Patrones y Hooks de React Utilizados:
1. **`useState` (Reactividad de la UI)**:
   * `productos`: Controla el listado maestro de existencias. Su mutación actualiza instantáneamente la tabla y las tarjetas de métricas.
   * `busqueda`: Vinculado bidireccionalmente al input de búsqueda. Filtra los productos en el cliente de forma instantánea mediante `.filter()`.
   * `formulario`: Guarda temporalmente los datos del producto en edición o creación.
   * `modalEliminar`: Almacena si el modal interactivo de borrado está visible y la información del producto asociado.
2. **`useEffect` (Sincronización)**:
   * Ejecuta la carga inicial de datos en el ciclo de vida de montaje (`componentDidMount` equivalente) mediante un fetch GET.
3. **Actualización Inmutable de Estado**:
   * En lugar de alterar directamente los estados, aplicamos técnicas funcionales inmutables como el operador de propagación (spread operator `[...productos, nuevo]`), mapeos estructurados (`.map()`) y filtros dinámicos (`.filter()`).

---

## 🎨 5. Diseño e Integración UI Premium

Toda la maquetación se resolvió con **CSS moderno puro** para evitar sobrecargar la SPA con frameworks de terceros y mantener un código limpio y educativo:
* **Desenfoque de Fondo (Backdrop Blur)**: Al mostrar el modal de borrado, la clase `.modal-overlay` aplica un desenfoque de cristal empañado (`backdrop-filter: blur(8px)`) sobre el dashboard.
* **Control Visual de Almacén**:
  * Stock saludable (> 5): Badge de color verde oliva suave.
  * Stock crítico (1 - 4): Badge ámbar con animación de pulso lento (`animation: pulse-soft`).
  * Sin stock (0): Badge rojo vibrante con una animación de borde parpadeante elástica para alertar de forma crítica al administrador.
