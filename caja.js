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

let total = 0;

for(let i = 0; i < pedidos.length; i++){

  total = total + pedidos[i].precio;

}

console.log("Total: $" + total);