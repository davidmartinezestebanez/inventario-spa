import React, { useState, useEffect } from 'react';

// URL base para comunicarnos con nuestro backend desacoplado
const API_URL = 'http://localhost:5000/productos';

function App() {
  // ====================================================================
  // 1. DECLARACIÓN DE ESTADOS (useState)
  // Explicación para el vídeo: useState es un hook de React que nos permite
  // crear variables de estado. Cuando este estado cambia, React vuelve a
  // renderizar la interfaz de usuario automáticamente para mostrar los datos actualizados.
  // ====================================================================

  // Lista de productos cargada desde la API
  const [productos, setProductos] = useState([]);
  
  // Término de búsqueda escrito por el usuario
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para controlar el formulario (Añadir / Editar)
  const [formulario, setFormulario] = useState({
    id: null,
    nombre: '',
    categoria: '',
    precio: '',
    stock: ''
  });
  
  // Controla si estamos editando un producto o creando uno nuevo
  const [editando, setEditando] = useState(false);

  // Mensajes de error o éxito temporales
  const [mensajeError, setMensajeError] = useState('');

  // Estado para controlar el modal personalizado de confirmación de eliminación
  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    productoId: null,
    productoNombre: ''
  });

  // ====================================================================
  // 2. EFECTOS (useEffect)
  // Explicación para el vídeo: useEffect nos permite ejecutar código de efecto
  // secundario, como hacer peticiones HTTP al cargar la aplicación.
  // El array vacío `[]` indica que este código solo se ejecutará UNA vez al iniciar.
  // ====================================================================
  useEffect(() => {
    cargarProductos();
  }, []);

  // ====================================================================
  // 3. FUNCIONES DE COMUNICACIÓN CON LA API (fetch y CRUD)
  // ====================================================================

  // GET: Cargar productos desde el backend
  const cargarProductos = async () => {
    try {
      // fetch realiza una petición HTTP GET por defecto a la URL indicada
      const respuesta = await fetch(API_URL);
      if (!respuesta.ok) throw new Error('Error al obtener productos');
      
      const datos = await respuesta.json();
      
      // Actualizamos el estado con los datos recibidos. Esto refresca la tabla automáticamente.
      setProductos(datos);
    } catch (error) {
      console.error('Error:', error);
      setMensajeError('No se pudo conectar con el servidor. ¿Está encendido el Backend?');
    }
  };

  // POST / PUT: Manejar el envío del formulario (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue (comportamiento por defecto)

    // Validación sencilla antes de enviar
    if (!formulario.nombre || !formulario.categoria || formulario.precio === '' || formulario.stock === '') {
      setMensajeError('Todos los campos son obligatorios.');
      return;
    }

    setMensajeError('');

    // Preparamos el cuerpo del JSON para la petición
    const productoData = {
      nombre: formulario.nombre,
      categoria: formulario.categoria,
      precio: parseFloat(formulario.precio),
      stock: parseInt(formulario.stock)
    };

    try {
      if (editando) {
        // --- PROCESO PUT (ACTUALIZAR) ---
        // Explicación para el vídeo: Hacemos una petición PUT incluyendo el ID en la URL.
        const respuesta = await fetch(`${API_URL}/${formulario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoData)
        });

        if (!respuesta.ok) throw new Error('Error al actualizar el producto');
        const productoActualizado = await respuesta.json();

        // Explicación para el vídeo: Para actualizar el estado, mapeamos el array
        // reemplazando el producto viejo por el producto actualizado devuelto por el servidor.
        setProductos(productos.map(p => p.id === formulario.id ? productoActualizado : p));
        setEditando(false);
      } else {
        // --- PROCESO POST (CREAR) ---
        // Explicación para el vídeo: Enviamos una petición POST con los datos estructurados en formato JSON.
        const respuesta = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productoData)
        });

        if (!respuesta.ok) throw new Error('Error al crear el producto');
        const nuevoProducto = await respuesta.json();

        // Explicación para el vídeo: Agregamos el nuevo producto al array existente de forma inmutable
        // usando el operador spread `[...productos, nuevoProducto]`.
        setProductos([...productos, nuevoProducto]);
      }

      // Reiniciamos el formulario a su estado vacío
      resetFormulario();
    } catch (error) {
      console.error('Error al guardar:', error);
      setMensajeError('Error de comunicación con la API.');
    }
  };

  // Explicación para el vídeo: En lugar de usar window.confirm(), guardamos los datos del producto
  // a eliminar en el estado y abrimos el modal de confirmación personalizado.
  const abrirConfirmacionEliminar = (producto) => {
    setModalEliminar({
      abierto: true,
      productoId: producto.id,
      productoNombre: producto.nombre
    });
  };

  // DELETE: Confirmar y ejecutar la eliminación en el backend
  const ejecutarEliminar = async () => {
    const id = modalEliminar.productoId;
    try {
      // Explicación para el vídeo: Hacemos una petición DELETE al endpoint con el ID correspondiente.
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) throw new Error('Error al eliminar producto');

      // Explicación para el vídeo: Para actualizar el estado visualmente sin recargar la página,
      // filtramos el array quitando el producto con el ID seleccionado.
      setProductos(productos.filter(p => p.id !== id));
      
      // Cerramos el modal de confirmación
      cerrarModalEliminar();
    } catch (error) {
      console.error('Error al eliminar:', error);
      setMensajeError('Error al intentar eliminar el producto.');
      cerrarModalEliminar();
    }
  };

  const cerrarModalEliminar = () => {
    setModalEliminar({ abierto: false, productoId: null, productoNombre: '' });
  };

  // Activar modo edición cargando los datos al formulario
  const seleccionarEditar = (producto) => {
    setFormulario({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock
    });
    setEditando(true);
    setMensajeError('');
  };

  // Cancelar edición y limpiar formulario
  const resetFormulario = () => {
    setFormulario({ id: null, nombre: '', categoria: '', precio: '', stock: '' });
    setEditando(false);
    setMensajeError('');
  };

  // Manejar el cambio de valores de los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  // ====================================================================
  // 4. LÓGICA DE BÚSQUEDA Y MÉTRICAS EN TIEMPO REAL
  // ====================================================================

  // Filtrado de productos según la barra de búsqueda en tiempo real
  const productosFiltrados = productos.filter(p => {
    const termino = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino)
    );
  });

  // Métricas calculadas dinámicamente cada vez que cambia el estado `productos`
  const totalProductos = productos.length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  const stockBajoCount = productos.filter(p => p.stock < 5).length;

  return (
    <div className="app-container">
      
      {/* Banner de error cuando no hay servidor */}
      {mensajeError && (
        <div className="alert-banner">
          <span>⚠️ {mensajeError}</span>
          <button className="btn-icon" onClick={() => setMensajeError('')} style={{color: 'inherit', background: 'none'}}>✕</button>
        </div>
      )}

      {/* Encabezado Principal */}
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Dashboard de Inventario</h1>
          <p>Control empresarial y analíticas de productos en tiempo real</p>
        </div>
        <div className="api-badge">
          <span className="api-badge-indicator"></span>
          Conexión API REST activa
        </div>
      </header>

      {/* Tarjetas de Métricas KPI */}
      <section className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Productos</span>
          <span className="metric-value">{totalProductos}</span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Valor del Inventario</span>
          <span className="metric-value">
            ${valorInventario.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Explicación para el vídeo: Esta tarjeta cambia de estilo dinámicamente si hay stock crítico */}
        <div className={`metric-card ${stockBajoCount > 0 ? 'danger-card' : ''}`}>
          <span className="metric-label">Alertas de Stock Bajo</span>
          <span className="metric-value" style={{ color: stockBajoCount > 0 ? 'var(--color-danger)' : 'inherit' }}>
            {stockBajoCount}
          </span>
        </div>
      </section>

      {/* Distribución del Dashboard (Grilla de 2 columnas) */}
      <main className="dashboard-layout">
        
        {/* COLUMNA 1: Tabla de Inventario */}
        <section className="content-box">
          <div className="box-header">
            <h2 className="box-title">Listado de Existencias</h2>
            <span className="badge badge-category" style={{backgroundColor: '#f1f5f9', color: '#475569'}}>
              Mostrando {productosFiltrados.length}
            </span>
          </div>

          {/* Buscador interactivo en tiempo real */}
          <div className="search-bar-container">
            <span className="search-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar producto por nombre o categoría..."
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            {productosFiltrados.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{color: '#94a3b8', marginBottom: '1rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"></path>
                </svg>
                <p>No se encontraron productos en el inventario.</p>
              </div>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th style={{ textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id}>
                      <td style={{ fontWeight: '600', color: '#1e293b' }}>
                        {producto.nombre}
                      </td>
                      <td>
                        <span className="badge badge-category">
                          {producto.categoria}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>
                        ${producto.precio.toFixed(2)}
                      </td>
                      <td>
                        {/* Explicación para el vídeo: Cambiamos dinámicamente la clase del badge 
                            según el número de existencias (stock bajo < 5) */}
                        <span className={`badge badge-stock ${
                          producto.stock === 0 
                            ? 'danger' 
                            : producto.stock < 5 
                              ? 'warning' 
                              : 'healthy'
                        }`}>
                          {producto.stock} unidades {producto.stock < 5 ? '(Stock Bajo)' : ''}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon btn-edit"
                            title="Editar"
                            onClick={() => seleccionarEditar(producto)}
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                            </svg>
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            title="Eliminar"
                            onClick={() => abrirConfirmacionEliminar(producto)}
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* COLUMNA 2: Formulario (Añadir/Editar) */}
        <section className="content-box">
          <div className="box-header">
            <h2 className="box-title">
              {editando ? 'Editar Producto' : 'Añadir Producto'}
            </h2>
            {editando && (
              <span className="badge badge-stock warning">Modo Edición</span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                placeholder="Ej. Mouse Inalámbrico Logi"
                value={formulario.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                className="form-control"
                value={formulario.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Oficina">Oficina</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Mobiliario">Mobiliario</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="precio"
                name="precio"
                className="form-control"
                placeholder="0.00"
                value={formulario.precio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Unidades en Stock</label>
              <input
                type="number"
                min="0"
                id="stock"
                name="stock"
                className="form-control"
                placeholder="0"
                value={formulario.stock}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              {editando ? (
                <>
                  <button type="submit" className="btn btn-primary">
                    Actualizar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetFormulario}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Agregar Producto
                </button>
              )}
            </div>
          </form>
        </section>

      </main>

      {/* ====================================================================
          MODAL DE CONFIRMACIÓN PERSONALIZADO (React + CSS Moderno)
          Explicación para el vídeo: Renderizado condicional en base a `modalEliminar.abierto`.
          El overlay cuenta con desenfoque de fondo y animación de fade-in.
          ==================================================================== */}
      {modalEliminar.abierto && (
        <div className="modal-overlay" onClick={cerrarModalEliminar}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="modal-title">¿Eliminar producto?</h3>
            <p className="modal-text">
              Estás a punto de eliminar <strong>"{modalEliminar.productoNombre}"</strong> de forma permanente. Esta acción no se puede deshacer.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={cerrarModalEliminar}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={ejecutarEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
