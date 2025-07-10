// Selección de botones y grupos de logos
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2');
const grupo1 = document.getElementById('grupo-1');
const grupo2 = document.getElementById('grupo-2');

// Mostrar grupo 1
btn1.addEventListener('click', () => {
  grupo1.classList.add('grupo-activo');
  grupo2.classList.remove('grupo-activo');
  btn1.classList.add('activo');
  btn2.classList.remove('activo');
});

// Mostrar grupo 2
btn2.addEventListener('click', () => {
  grupo2.classList.add('grupo-activo');
  grupo1.classList.remove('grupo-activo');
  btn2.classList.add('activo');
  btn1.classList.remove('activo');
});
