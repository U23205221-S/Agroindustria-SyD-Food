// Funcionalidad para el formulario de contacto
document.getElementById('formulario-contacto')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('¡Mensaje enviado! Nos pondremos en contacto contigo lo antes posible.');
  this.reset();
});

// Funcionalidad para los botones de filtro en el catálogo
document.querySelectorAll('.boton-filtro').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.boton-filtro').forEach(btn => btn.classList.remove('activo'));
    this.classList.add('activo');
    //lógica para filtrar productos si estuvieran en un array
    console.log('Filtro seleccionado:', this.textContent.trim());
  });
});


