const net = require('net');
const { catalogoProductos } = require('../catalogo.js');
let pedidos = [];
let activeCarrito = null;
let clienteSocket = null;
let cocinaSocket = null;

function agregarPedido(producto) {
  pedidos.push(producto);
}

function procesarCompraEnCaja(carrito, callback) {
  pedidos = carrito;
  console.log(`\n[Caja] Procesando pago asincronamente...`);
  setTimeout(() => {
    if (!pedidos || pedidos.length === 0) {
      if (callback) callback("cancelado", null);
      return;
    }
    const nombres = pedidos.map(p => p.nombre).join(', ');
    const cantidades = pedidos.map(p => p.cantidad).join(', ');
    const subtotal = pedidos.reduce((suma, p) => suma + (p.precio * p.cantidad), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    console.log(`[Caja] Pago aprobado!`);
    if (callback) callback("listo", { nombres, cantidades, subtotal, iva, total });
  }, 2000);
}

const sendJSON = (socket, obj) => socket && !socket.destroyed && socket.write(JSON.stringify(obj) + '\n');

function iniciarServidorCaja() {
  const server = net.createServer((socket) => {
    let buffer = '';
    socket.on('data', (data) => {
      buffer += data.toString();
      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        const input = buffer.substring(0, boundary).trim();
        buffer = buffer.substring(boundary + 1);
        if (input) {
          try {
            const msg = JSON.parse(input);
            if (msg.type === 'REGISTRO_CLIENTE') {
              if (msg.role === 'cliente') { clienteSocket = socket; console.log('[Caja] Terminal CLIENTE conectado.'); }
              if (msg.role === 'cocina') { cocinaSocket = socket; console.log('[Caja] Terminal COCINA conectado.'); }
              sendJSON(socket, { type: 'REGISTRO_OK' });
            }
            if (msg.type === 'NUEVO_PEDIDO') {
              console.log(`\n[Caja] Recibido pedido del Cliente. Enviando a Cocina para preparacion...`);
              activeCarrito = msg.carrito;
              if (cocinaSocket) sendJSON(cocinaSocket, { type: 'PREPARAR_PEDIDO', carrito: msg.carrito });
              else sendJSON(socket, { type: 'PEDIDO_CANCELADO', motivo: 'Cocina desconectada.' });
            }
            if (msg.type === 'PREPARACION_PROGRESO' || msg.type === 'PEDIDO_CANCELADO') {
              if (msg.type === 'PEDIDO_CANCELADO') {
                console.log(`[Caja] Pedido cancelado por: ${msg.motivo}`);
                activeCarrito = null;
              }
              if (clienteSocket) sendJSON(clienteSocket, msg);
            }
            if (msg.type === 'PEDIDO_LISTO') {
              console.log(`[Caja] Pedido listo en cocina. Cobrando...`);
              procesarCompraEnCaja(activeCarrito, (estado, datos) => {
                if (estado === 'listo') {
                  if (clienteSocket) sendJSON(clienteSocket, { type: 'TRANSACCION_COMPLETADA', ticket: datos });
                  if (cocinaSocket) sendJSON(cocinaSocket, { type: 'COMPRA_FINALIZADA' });
                } else {
                  if (clienteSocket) sendJSON(clienteSocket, { type: 'PEDIDO_CANCELADO', motivo: 'Cobro rechazado.' });
                }
                activeCarrito = null;
              });
            }
            if (msg.type === 'PEDIDO_INGREDIENTE_FALTANTE') {
              if (clienteSocket) sendJSON(clienteSocket, msg);
            }
            if (msg.type === 'CLIENTE_DECISION') {
              if (cocinaSocket) sendJSON(cocinaSocket, msg);
            }
          } catch (e) { }
        }
        boundary = buffer.indexOf('\n');
      }
    });
    socket.on('close', () => {
      if (socket === clienteSocket) clienteSocket = null;
      if (socket === cocinaSocket) cocinaSocket = null;
    });
    socket.on('error', () => { });
  });

  server.on('error', (err) => {
    // Si ya esta ocupado el puerto, no pasa nada
  });

  server.listen(5001);
}

if (require.main === module) {
  console.clear();
  console.log(`CAJA CENTRAL - SERVIDOR TCP INICIADO EN PUERTO 5001\nEsperando conexiones de Cocina y Cliente...\n`);
  iniciarServidorCaja();
}

module.exports = { agregarPedido, procesarCompraEnCaja, iniciarServidorCaja };