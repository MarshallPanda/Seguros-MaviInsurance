
// Rotación automática de testimonios
const testimonios = document.querySelectorAll(".testimonio");
let index = 0;

setInterval(() => {
    testimonios[index].classList.remove("activo");
    index = (index + 1) % testimonios.length;
    testimonios[index].classList.add("activo");
}, 5000);

