["header", "footer"].forEach(id => {
  fetch(`../Parciales HF/${id}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
});
