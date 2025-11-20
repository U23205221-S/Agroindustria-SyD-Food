// FUNCIONES DE RENDERIZADO DEL CATÁLOGO
// Función para renderizar productos dinámicamente
function cargarProductos(lista) {
  const contenedor = document.querySelector('.grid-productos');
  
  if (!contenedor) return; // Si no existe el contenedor, salir de la función
  
  // Limpiar contenedor
  contenedor.innerHTML = '';
  
  // Generar HTML para cada producto
  lista.forEach(producto => {
    const tarjetaHTML = `
      <div class="tarjeta-producto" data-categoria="${producto.categoria}">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="info-producto">
          <div class="encabezado-producto">
            <h3>${producto.nombre}</h3>
            <span class="etiqueta-categoria">${producto.categoria}</span>
          </div>
          <p>${producto.descripcion}</p>
          <div class="especificaciones-producto">
            <span>Presentación:</span>
            <span>${producto.presentacion}</span>
          </div>
        </div>
      </div>
    `;
    contenedor.innerHTML += tarjetaHTML;
  });
  
  // Actualizar el contador de productos
  actualizarContador(lista.length);
}

// Función para actualizar el contador de productos mostrados
function actualizarContador(cantidad) {
  const contadorElemento = document.querySelector('.conteo-productos');
  if (contadorElemento) {
    contadorElemento.textContent = `Mostrando ${cantidad} producto${cantidad !== 1 ? 's' : ''}`;
  }
}

// Función para actualizar los contadores de categorías en los botones
function actualizarContadoresCategorias() {
  const totalProductos = productos.length;
  const totalMenestras = productos.filter(p => p.categoria === 'Menestras').length;
  const totalCereales = productos.filter(p => p.categoria === 'Cereales').length;
  
  const botones = document.querySelectorAll('.boton-filtro');
  botones.forEach(boton => {
    const texto = boton.textContent.trim();
    const spanContador = boton.querySelector('.filtros-categoria');
    
    if (spanContador) {
      if (texto.includes('Todos')) {
        spanContador.textContent = totalProductos;
      } else if (texto.includes('Menestras')) {
        spanContador.textContent = totalMenestras;
      } else if (texto.includes('Cereales')) {
        spanContador.textContent = totalCereales;
      }
    }
  });
}

// ============================================
// LÓGICA DE FILTRADO
// ============================================

// Función para filtrar productos por categoría
function filtrarProductos(categoria) {
  let productosFiltrados;
  
  if (categoria === 'Todos') {
    productosFiltrados = productos;
  } else {
    productosFiltrados = productos.filter(producto => producto.categoria === categoria);
  }
  
  cargarProductos(productosFiltrados);
}

// Event listeners para los botones de filtro
function inicializarFiltros() {
  const botonesFiltro = document.querySelectorAll('.boton-filtro');
  
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', function() {
      // Remover clase activo de todos los botones
      botonesFiltro.forEach(btn => btn.classList.remove('activo'));
      
      // Agregar clase activo al botón clickeado
      this.classList.add('activo');
      
      // Obtener la categoría del texto del botón
      const textoBoton = this.textContent.trim();
      let categoriaSeleccionada;
      
      if (textoBoton.includes('Todos')) {
        categoriaSeleccionada = 'Todos';
      } else if (textoBoton.includes('Menestras')) {
        categoriaSeleccionada = 'Menestras';
      } else if (textoBoton.includes('Cereales')) {
        categoriaSeleccionada = 'Cereales';
      }
      
      // Filtrar productos
      filtrarProductos(categoriaSeleccionada);
    });
  });
}

// ============================================
// INICIALIZACIÓN DEL CATÁLOGO
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si estamos en la página del catálogo
  if (document.querySelector('.grid-productos')) {
    cargarProductos(productos);
    actualizarContadoresCategorias();
    inicializarFiltros();
  }
});


// FUNCIONALIDAD DEL FORMULARIO DE CONTACTO


// Funcionalidad para el formulario de contacto
document.getElementById('formulario-contacto')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('¡Mensaje enviado! Nos pondremos en contacto contigo lo antes posible.');
  this.reset();
});


