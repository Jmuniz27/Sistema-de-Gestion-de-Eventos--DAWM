// script.js
document.getElementById("btnNuevaFactura").addEventListener("click", () => {
  alert("Funcionalidad para crear nueva factura en desarrollo...");
});

function agregarFactura(codigo, fecha, estado, monto, cliente) {
  const tabla = document.getElementById("tablaFacturas");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${codigo}</td>
    <td>${fecha}</td>
    <td class="status ${estado.toLowerCase()}">${estado}</td>
    <td>${monto}</td>
    <td>${cliente}</td>
  `;

  tabla.prepend(fila);
}
