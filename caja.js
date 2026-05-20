const { catalogoProductos } = require('./catalogo.js');
let pedidos = [];

function agregarPedido(producto) {
  pedidos.push(producto);
}

function procesarCompraEnCaja(carrito) {
  pedidos = carrito;

  const nombres = pedidos.map(p => p.nombre).join(', ');
  const cantidades = pedidos.map(p => p.cantidad).join(', ');

  const subtotal = pedidos.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  console.log("producto o productos: " + nombres);
  console.log("cantidad de producto o productos: " + cantidades);
  console.log("subtotal: $" + subtotal.toFixed(2));
  console.log("iva: $" + iva.toFixed(2));
  console.log("total: $" + total.toFixed(2));
}

if (require.main === module) {
  const pedidosEjemplo = [
    { ...catalogoProductos.productos[0], cantidad: 1 },
    { ...catalogoProductos.productos[3], cantidad: 1 },
    { ...catalogoProductos.productos[7], cantidad: 1 }
  ];
  procesarCompraEnCaja(pedidosEjemplo);
}

module.exports = {
  agregarPedido,
  procesarCompraEnCaja
};