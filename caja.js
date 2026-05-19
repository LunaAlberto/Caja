const { catalogoProductos } = require('./catalogo.js');
let pedidos = [];

function agregarPedido(producto){
  pedidos.push(producto);
}

agregarPedido(catalogoProductos.productos[0]);
agregarPedido(catalogoProductos.productos[3]);
agregarPedido(catalogoProductos.productos[7]);

console.log("Pedidos");
console.table(pedidos);

const subtotal = pedidos.reduce((suma, { precio }) => suma + precio, 0);
const iva = subtotal * 0.16;
const total = subtotal + iva;

console.log("Subtotal: $" + subtotal);
console.log("IVA: $" + iva);
console.log("Total: $" + total);