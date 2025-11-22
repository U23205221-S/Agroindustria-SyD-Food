// Función para renderizar productos dinámicamente
function cargarProductos(lista) {
  const contenedor = document.querySelector('.grid-productos');
  
  if (!contenedor) return; // Si no existe el contenedor sale de la función
  
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

// FORMULARIO DE CONTACTO CON EMAILJS
//Configuración de EmailJS

const EMAILJS_CONFIG = {
  // Public Key de EmailJS
  PUBLIC_KEY: '9I7SvJDXcnHVFjpgF',
  // ID del servicio de email
  SERVICE_ID: 'service_55a1vld',
  // ID del template de email
  TEMPLATE_ID: 'template_bpugwjj',
  // Email de destino
  TO_EMAIL: 'renzosa1906@gmail.com'
};

// Módulo para gestionar el formulario de contacto

const FormularioContacto = {
  formulario: null,
  btnEnviar: null,
  textoBoton: null,
  mensajeExito: null,
  mensajeError: null,
  textoError: null,

  //Inicializa el módulo del formulario
  init() {
    this.formulario = document.getElementById('formulario-contacto');
    
    if (!this.formulario) {
      return;
    }

    // Inicializar EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    // Obtener referencias a elementos del DOM
    this.btnEnviar = document.getElementById('btn-enviar');
    this.textoBoton = document.getElementById('texto-boton');
    this.mensajeExito = document.getElementById('mensaje-exito');
    this.mensajeError = document.getElementById('mensaje-error');
    this.textoError = document.getElementById('texto-error');

    // Agregar event listener al formulario
    this.formulario.addEventListener('submit', (e) => {
      this.manejarEnvio(e);
    });
  },

   // Maneja el envío del formulario
    // @param {Event} event - Evento de submit del formulario
  async manejarEnvio(event) {
    event.preventDefault();

    // Obtener datos del formulario
    const formData = new FormData(this.formulario);
    const datos = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono') || 'No proporcionado',
      empresa: formData.get('empresa') || 'No proporcionado',
      mensaje: formData.get('mensaje'),
      to_email: EMAILJS_CONFIG.TO_EMAIL
    };

    // Validar campos requeridos
    if (!datos.nombre || !datos.email || !datos.mensaje) {
      this.mostrarError('Por favor, completa todos los campos requeridos.');
      return;
    }

    // Mostrar estado de carga
    this.mostrarCargando(true);

    try {
      // Enviar email usando EmailJS
      const respuesta = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: datos.nombre,
          from_email: datos.email,
          telefono: datos.telefono,
          empresa: datos.empresa,
          message: datos.mensaje,
          to_email: datos.to_email,
          reply_to: datos.email
        }
      );

      // Éxito
      if (respuesta.status === 200) {
        this.mostrarExito();
        this.formulario.reset();
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.mostrarError('Error al enviar el mensaje. Por favor, intenta nuevamente más tarde.');
    } finally {
      this.mostrarCargando(false);
    }
  },

   // Muestra el estado de carga
   // @param {boolean} cargando - Indica si está cargando
  mostrarCargando(cargando) {
    if (this.btnEnviar) {
      this.btnEnviar.disabled = cargando;
      if (this.textoBoton) {
        this.textoBoton.textContent = cargando ? 'Enviando...' : 'Enviar mensaje';
      }
    }
    this.ocultarMensajes();
  },

  // Muestra mensaje de éxito
  mostrarExito() {
    if (this.mensajeExito) {
      this.mensajeExito.style.display = 'block';
      this.mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (this.mensajeError) {
      this.mensajeError.style.display = 'none';
    }

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      if (this.mensajeExito) {
        this.mensajeExito.style.display = 'none';
      }
    }, 5000);
  },

   //Muestra mensaje de error @param {string} mensaje - Mensaje de error a mostrar
  mostrarError(mensaje) {
    if (this.mensajeError) {
      this.mensajeError.style.display = 'block';
      if (this.textoError) {
        this.textoError.textContent = mensaje;
      }
      this.mensajeError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (this.mensajeExito) {
      this.mensajeExito.style.display = 'none';
    }

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      if (this.mensajeError) {
        this.mensajeError.style.display = 'none';
      }
    }, 5000);
  },

  //Oculta todos los mensajes
  ocultarMensajes() {
    if (this.mensajeExito) {
      this.mensajeExito.style.display = 'none';
    }
    if (this.mensajeError) {
      this.mensajeError.style.display = 'none';
    }
  }
};


// MENÚ HAMBURGUESA

//Módulo para gestionar el menú hamburguesa en dispositivos móviles proporciona funcionalidad de toggle, cierre automático y navegación

const MenuHamburguesa = {
  // Referencias a elementos del DOM
  botonHamburguesa: null,
  navegacion: null,
  icono: null,
  enlacesNavegacion: null,
  inicializado: false,

  //Inicializa el módulo del menú hamburguesa
  init() {
    // Evitar inicialización múltiple
    if (this.inicializado) {
      return;
    }

    this.botonHamburguesa = document.querySelector('.menu-hamburguesa');
    this.navegacion = document.querySelector('.navegacion');

    if (!this.botonHamburguesa || !this.navegacion) {
      console.warn('MenuHamburguesa: No se encontraron los elementos necesarios');
      return;
    }

    this.icono = this.botonHamburguesa.querySelector('i');
    this.enlacesNavegacion = this.navegacion.querySelectorAll('a');

    this.agregarEventListeners();
    this.inicializado = true;
  },

  //Agrega todos los event listeners necesarios
  agregarEventListeners() {
    // Handler para el toggle del menú
    const handleToggleClick = (e) => {
      e.stopPropagation();
      this.toggleMenu();
    };

    // Handler para cerrar el menú al hacer clic en un enlace
    const handleEnlaceClick = () => {
      this.cerrarMenu();
    };

    // Handler para cerrar el menú al hacer clic fuera
    const handleClickOutside = (event) => {
      const esClickEnNavegacion = this.navegacion.contains(event.target);
      const esClickEnBoton = this.botonHamburguesa.contains(event.target);

      if (!esClickEnNavegacion && !esClickEnBoton && this.estaAbierto()) {
        this.cerrarMenu();
      }
    };

    // Handler para cerrar con Escape
    const handleEscape = (event) => {
      if (event.key === 'Escape' && this.estaAbierto()) {
        this.cerrarMenu();
      }
    };

    // Agregar event listeners
    this.botonHamburguesa.addEventListener('click', handleToggleClick);

    // Cerrar el menú al hacer clic en un enlace
    this.enlacesNavegacion.forEach((enlace) => {
      enlace.addEventListener('click', handleEnlaceClick);
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', handleClickOutside);

    // Cerrar el menú con la tecla Escape
    document.addEventListener('keydown', handleEscape);
  },

  //retorna boolean
  estaAbierto() {
    return this.navegacion.classList.contains('activo');
  },

  //Alterna el estado del menú (abrir/cerrar)
  toggleMenu() {
    if (this.estaAbierto()) {
      this.cerrarMenu();
    } else {
      this.abrirMenu();
    }
  },

  //Abre el menú hamburguesa
  abrirMenu() {
    this.navegacion.classList.add('activo');
    this.actualizarIcono(true);
  },

  //Cierra el menú hamburguesa
  cerrarMenu() {
    this.navegacion.classList.remove('activo');
    this.actualizarIcono(false);
  },

  //retorna boolean si esta abierto o cerrado
  actualizarIcono(abierto) {
    if (!this.icono) return;

    if (abierto) {
      this.icono.classList.remove('bi-list');
      this.icono.classList.add('bi-x-lg');
    } else {
      this.icono.classList.remove('bi-x-lg');
      this.icono.classList.add('bi-list');
    }
  }
};

// Inicialización general

document.addEventListener('DOMContentLoaded', function() {
  // Inicializa menú hamburguesa
  MenuHamburguesa.init();
  // Inicializa formulario de contacto
  FormularioContacto.init();
  // Inicializa catálogo si existe
  if (document.querySelector('.grid-productos')) {
    cargarProductos(productos);
  }
});


