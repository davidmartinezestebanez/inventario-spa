// ====================================================================
// BACKEND: API REST de Inventario
// Este servidor está diseñado para ser simple, limpio y fácil de explicar.
// ====================================================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// MIDDLEWARES
// cors() permite que el frontend (ej. puerto 5173) se comunique con el backend (puerto 5000)
app.use(cors());

// express.json() permite a la aplicación entender y procesar peticiones en formato JSON (req.body)
app.use(express.json());

// BASE DE DATOS EN MEMORIA (Array de objetos)
// Al reiniciar el servidor de Node, estos datos volverán a su estado inicial.
let productos = [
  { id: 1, nombre: 'Laptop Dell XPS 13', categoria: 'Tecnología', precio: 1200, stock: 15 },
  { id: 2, nombre: 'Monitor LG 27" 4K', categoria: 'Tecnología', precio: 350, stock: 4 }, // Stock bajo (< 5)
  { id: 3, nombre: 'Silla Ergonómica Pro', categoria: 'Oficina', precio: 250, stock: 8 },
  { id: 4, nombre: 'Teclado Mecánico RGB', categoria: 'Accesorios', precio: 99.99, stock: 3 } // Stock bajo (< 5)
];

// Contador de IDs para generar identificadores únicos y secuenciales para nuevos productos
let nextId = 5;

// ====================================================================
// ENDPOINTS DE LA API (CRUD)
// ====================================================================

// 1. GET /productos - Obtener la lista completa de productos
app.get('/productos', (req, res) => {
  // Explicación para el vídeo: Este endpoint se ejecuta cuando el frontend hace una petición HTTP GET.
  // Responde enviando todo el array de productos en formato JSON.
  res.json(productos);
});

// 2. POST /productos - Crear un nuevo producto
app.post('/productos', (req, res) => {
  // Explicación para el vídeo: Se ejecuta con una petición POST. Recibe los datos enviados por el frontend
  // desde el cuerpo de la petición (req.body) y los añade al array en memoria.
  const { nombre, categoria, precio, stock } = req.body;

  // Validación básica de campos
  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  // Creamos el nuevo objeto de producto generando un ID secuencial autoincremental
  const nuevoProducto = {
    id: nextId++,
    nombre,
    categoria,
    precio: Number(precio),
    stock: Number(stock)
  };

  // Agregamos el producto a nuestra lista en memoria
  productos.push(nuevoProducto);

  // Retornamos el producto creado con código de estado HTTP 201 (Creado)
  res.status(201).json(nuevoProducto);
});

// 3. PUT /productos/:id - Actualizar un producto existente
app.put('/productos/:id', (req, res) => {
  // Explicación para el vídeo: Actualiza un producto. Recibe el ID de la URL y los nuevos datos en el body.
  const id = parseInt(req.params.id);
  const { nombre, categoria, precio, stock } = req.body;

  // Buscamos el índice del producto en nuestro array
  const indice = productos.findIndex(p => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  // Actualizamos el producto existente combinando los datos anteriores con los nuevos
  productos[indice] = {
    id,
    nombre: nombre || productos[indice].nombre,
    categoria: categoria || productos[indice].categoria,
    precio: precio !== undefined ? Number(precio) : productos[indice].precio,
    stock: stock !== undefined ? Number(stock) : productos[indice].stock
  };

  // Devolvemos el producto actualizado
  res.json(productos[indice]);
});

// 4. DELETE /productos/:id - Eliminar un producto
app.delete('/productos/:id', (req, res) => {
  // Explicación para el vídeo: Elimina un producto. Filtra la lista para quitar el producto con el ID especificado.
  const id = parseInt(req.params.id);
  
  // Verificamos si el producto existe antes de borrarlo
  const existe = productos.some(p => p.id === id);

  if (!existe) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  // Filtramos el array para quedarnos únicamente con los productos que no tengan el ID a eliminar
  productos = productos.filter(p => p.id !== id);

  // Enviamos respuesta de confirmación al frontend
  res.json({ mensaje: 'Producto eliminado correctamente', id });
});

// INICIALIZACIÓN DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`👉 Prueba la API en http://localhost:${PORT}/productos`);
});
