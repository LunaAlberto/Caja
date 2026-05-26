const readline = require('readline');

const colores = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m'
};

const { catalogoProductos, prepararPedido } = require('./catalogo.js');
const { iniciarServidorCaja } = require('./caja.js');

let carrito = [];
let clientSocket = null;
let resolveTransaction = null;
let rejectTransaction = null;

function sendJSON(socket, obj) {
  if (socket && !socket.destroyed) {
    socket.write(JSON.stringify(obj) + '\n');
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function limpiar() {
  console.clear();
}

function titulo(texto) {
  console.log(`\n${colores.bgBlue}${colores.bright}${colores.cyan} ${texto.padEnd(60)} ${colores.reset}\n`);
}

function separador() {
  console.log(`${colores.dim}${'═'.repeat(65)}${colores.reset}\n`);
}

function obtenerProductosConPromocion() {
  return catalogoProductos.productos.map(producto => {
    let descuento = 0;
    let promoTexto = "";

    if (producto.id === 3) {
      descuento = 0.20;
      promoTexto = "Promo Especial: 20% OFF";
    } else if (producto.precio > 5.00) {
      descuento = 0.15;
      promoTexto = "Oferta: 15% OFF";
    }

    const precioDescuento = producto.precio * (1 - descuento);

    return {
      ...producto,
      descuento: descuento,
      promoTexto: promoTexto,
      precioFinal: parseFloat(precioDescuento.toFixed(2))
    };
  });
}

function mostrarCatalogo() {
  limpiar();
  titulo("CATÁLOGO DE PRODUCTOS (COMPLETO)");

  const productosConPromo = obtenerProductosConPromocion();

  productosConPromo.forEach(p => {
    const promoBadge = p.descuento > 0 ? ` ${colores.bgGreen}${colores.bright} ${p.promoTexto} ${colores.reset}` : "";
    const precioTexto = p.descuento > 0
      ? `${colores.red}$${p.precio.toFixed(2)}${colores.reset} → ${colores.green}$${p.precioFinal.toFixed(2)}${colores.reset}`
      : `${colores.green}$${p.precio.toFixed(2)}${colores.reset}`;

    console.log(`  ${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset}${promoBadge}`);
    console.log(`      ${p.descripcion}`);
    console.log(`      ${precioTexto} | ${colores.dim}Stock: ${p.stock}${colores.reset}\n`);
  });
}

function mostrarProductosDisponibles() {
  limpiar();
  titulo("PRODUCTOS DISPONIBLES (CON STOCK)");

  const disponibles = catalogoProductos.productos.filter(p => p.stock > 0);

  if (disponibles.length === 0) {
    console.log(`${colores.red}✗ No hay productos con stock disponible en este momento.${colores.reset}\n`);
    return;
  }

  disponibles.forEach(p => {
    console.log(`  ${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset}`);
    console.log(`      ${p.descripcion}`);
    console.log(`      ${colores.green}$${p.precio.toFixed(2)}${colores.reset} | ${colores.cyan}Stock disponible: ${p.stock}${colores.reset}\n`);
  });
}

function mostrarPromociones() {
  limpiar();
  titulo("PROMOCIONES ESPECIALES");

  const productosConPromo = obtenerProductosConPromocion().filter(p => p.descuento > 0);

  if (productosConPromo.length === 0) {
    console.log(`${colores.dim}No hay promociones activas en este momento.${colores.reset}\n`);
    return;
  }

  productosConPromo.forEach(p => {
    console.log(`  ${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset} ${colores.bgGreen}${colores.bright} ${p.promoTexto} ${colores.reset}`);
    console.log(`      ${p.descripcion}`);
    console.log(`      Precio Regular: ${colores.red}$${p.precio.toFixed(2)}${colores.reset} → ${colores.green}Precio Especial: $${p.precioFinal.toFixed(2)}${colores.reset} | ${colores.dim}Stock: ${p.stock}${colores.reset}\n`);
  });
}

function mostrarMenuPrincipal() {
  limpiar();

  console.log(`${colores.bright}${colores.magenta}
       ╔═══════════════════════════════════════════════╗ 
       ║      BIENVENIDO A CAFÉ & DELICIAS            ║
       ╚═══════════════════════════════════════════════╝
${colores.reset}`);

  separador();

  if (carrito.length > 0) {
    let totalCarrito = 0;
    carrito.forEach(item => {
      totalCarrito += item.precio * item.cantidad;
    });
    console.log(`${colores.yellow}Artículos en carrito: ${carrito.length} | Total: ${colores.green}$${totalCarrito.toFixed(2)}${colores.reset}\n`);
  }

  console.log(`${colores.bright}Selecciona una opción:${colores.reset}\n`);
  console.log(`  ${colores.cyan}1${colores.reset} - Ver catálogo completo`);
  console.log(`  ${colores.cyan}2${colores.reset} - Ver productos disponibles (con stock)`);
  console.log(`  ${colores.cyan}3${colores.reset} - Ver promociones especiales`);
  console.log(`  ${colores.cyan}4${colores.reset} - Buscar producto`);
  console.log(`  ${colores.cyan}5${colores.reset} - Agregar al carrito`);
  console.log(`  ${colores.cyan}6${colores.reset} - Ver carrito`);
  console.log(`  ${colores.cyan}7${colores.reset} - Eliminar del carrito`);
  console.log(`  ${colores.cyan}8${colores.reset} - Procesar compra`);
  console.log(`  ${colores.cyan}9${colores.reset} - Vaciar carrito`);
  console.log(`  ${colores.cyan}0${colores.reset} - Salir\n`);
}

function mostrarCarrito() {
  limpiar();
  titulo("CARRITO DE COMPRAS");

  if (carrito.length === 0) {
    console.log(`${colores.dim}El carrito está vacío${colores.reset}\n`);
    return;
  }

  let total = 0;
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    console.log(`${index + 1}. ${colores.bright}${item.nombre}${colores.reset}`);
    if (item.precioOriginal && item.precioOriginal !== item.precio) {
      console.log(`   Cantidad: ${colores.yellow}${item.cantidad}${colores.reset} x ${colores.green}$${item.precio}${colores.reset} (${colores.red}Regular: $${item.precioOriginal.toFixed(2)}${colores.reset} - ${colores.bgGreen}${colores.bright} ${item.promoTexto} ${colores.reset}) = ${colores.green}$${subtotal.toFixed(2)}${colores.reset}\n`);
    } else {
      console.log(`   Cantidad: ${colores.yellow}${item.cantidad}${colores.reset} x ${colores.green}$${item.precio}${colores.reset} = ${colores.green}$${subtotal.toFixed(2)}${colores.reset}\n`);
    }
  });

  separador();
  console.log(`${colores.bright}${colores.green}TOTAL: $${total.toFixed(2)}${colores.reset}\n`);
}

function buscarProducto(termino) {
  const productosPromo = obtenerProductosConPromocion();
  const resultado = productosPromo.filter(p =>
    p.nombre.toLowerCase().includes(termino.toLowerCase()) || String(p.id) === termino
  );

  limpiar();

  if (resultado.length === 0) {
    console.log(`${colores.red}✗ No se encontraron productos${colores.reset}\n`);
    return;
  }

  titulo(`RESULTADOS DE BÚSQUEDA: "${termino}"`);

  resultado.forEach(p => {
    const promoBadge = p.descuento > 0 ? ` ${colores.bgGreen}${colores.bright} ${p.promoTexto} ${colores.reset}` : "";
    const precioTexto = p.descuento > 0
      ? `${colores.red}$${p.precio.toFixed(2)}${colores.reset} → ${colores.green}$${p.precioFinal.toFixed(2)}${colores.reset}`
      : `${colores.green}$${p.precio.toFixed(2)}${colores.reset}`;

    console.log(`  ${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset}${promoBadge}`);
    console.log(`      ${p.descripcion}`);
    console.log(`      ${precioTexto} | ${colores.dim}Stock: ${p.stock}${colores.reset}\n`);
  });
}

function agregarAlCarrito(idProducto, cantidad) {
  const producto = catalogoProductos.productos.find(p => p.id === parseInt(idProducto));

  if (!producto) {
    console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
    return false;
  }

  if (producto.stock <= 0) {
    console.log(`${colores.red}✗ Producto agotado.${colores.reset}\n`);
    return false;
  }

  if (cantidad > producto.stock) {
    console.log(`${colores.red}✗ Stock insuficiente. Disponibles: ${producto.stock}${colores.reset}\n`);
    return false;
  }

  const itemEnCarrito = carrito.find(item => item.id === producto.id);
  const productosPromo = obtenerProductosConPromocion();
  const productoPromo = productosPromo.find(p => p.id === producto.id);
  const precioAUsar = productoPromo ? productoPromo.precioFinal : producto.precio;

  if (itemEnCarrito) {
    if (itemEnCarrito.cantidad + cantidad > producto.stock) {
      console.log(`${colores.red}✗ No puedes agregar más de este producto. Stock total: ${producto.stock} (Ya tienes ${itemEnCarrito.cantidad} en el carrito)${colores.reset}\n`);
      return false;
    }
    itemEnCarrito.cantidad += cantidad;
  } else {
    carrito.push({
      ...producto,
      precio: precioAUsar,
      precioOriginal: producto.precio,
      promoTexto: productoPromo ? productoPromo.promoTexto : "",
      cantidad
    });
  }
  console.log(`${colores.green}[OK] ${producto.nombre} agregado al carrito${colores.reset}\n`);
  return true;
}


function barraProgreso(porcentaje) {
  const ancho = 40;
  const completado = Math.round((ancho * porcentaje) / 100);
  const faltante = ancho - completado;
  return `${colores.green}${'█'.repeat(completado)}${colores.dim}${'.'.repeat(faltante)}${colores.reset} ${porcentaje}%`;
}

function mostrarEstadoVisual(mensaje, color, progreso) {
  limpiar();
  titulo("ESTADO DEL PEDIDO");
  console.log(`\n  ${color}${colores.bright}>> ${mensaje}${colores.reset}`);
  console.log(`  ${barraProgreso(progreso)}\n`);
}

async function procesarCompra() {
  if (carrito.length === 0) {
    console.log(`${colores.red}✗ El carrito está vacío${colores.reset}\n`);
    return;
  }

  limpiar();
  titulo("RESUMEN DE COMPRA");

  let total = 0;
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    console.log(`${index + 1}. ${item.nombre} x${item.cantidad} = ${colores.green}$${subtotal.toFixed(2)}${colores.reset}`);
  });

  separador();
  console.log(`${colores.bright}${colores.green}TOTAL A PAGAR: $${total.toFixed(2)}${colores.reset}\n`);

  rl.question(`${colores.yellow}¿Deseas confirmar tu compra? (s/n): ${colores.reset}`, async (respuesta) => {
    if (respuesta.toLowerCase() === 's') {
      if (!clientSocket || clientSocket.destroyed) {
        console.log(`${colores.red}✗ Error: Sin conexión con la Caja Central. Por favor corre "node caja.js" primero.${colores.reset}\n`);
        rl.question(`${colores.dim}Presiona Enter para volver al menú...${colores.reset}`, () => menuPrincipal());
        return;
      }

      try {
        const transaccionRed = new Promise((resolve, reject) => {
          resolveTransaction = resolve;
          rejectTransaction = reject;
        });

        // --- ESTADO 1: Pedido recibido (10%) ---
        mostrarEstadoVisual("Enviando pedido a Caja y Cocina...", colores.blue, 10);

        // Enviar pedido real por el socket TCP
        sendJSON(clientSocket, { type: 'NUEVO_PEDIDO', carrito: carrito });

        // Esperar resolución en tiempo real (barra se llena con el progreso de Cocina)
        const ticket = await transaccionRed;

        // --- COMPRA EXITOSA ---
        carrito.forEach(item => {
          const productoOriginal = catalogoProductos.productos.find(p => p.id === item.id);
          if (productoOriginal) {
            productoOriginal.stock -= item.cantidad;
          }
        });

        limpiar();
        titulo("PEDIDO FINALIZADO");
        console.log(`${colores.bright}${colores.bgGreen}${colores.cyan} ¡COMPRA REALIZADA EXITOSAMENTE! ${colores.reset}\n`);
        console.log(`${colores.bright}${colores.yellow}TICKET DE COMPRA (CAJA CENTRAL):${colores.reset}`);
        console.log(`  Productos: ${ticket.nombres}`);
        console.log(`  Cantidades: ${ticket.cantidades}`);
        separador();
        console.log(`  Subtotal: $${ticket.subtotal.toFixed(2)}`);
        console.log(`  IVA (16%): $${ticket.iva.toFixed(2)}`);
        console.log(`  ${colores.green}TOTAL PAGADO: $${ticket.total.toFixed(2)}${colores.reset}`);
        separador();
        console.log(`${colores.dim}Notificación: El pedido ha sido aprobado por Cocina y cobrado en Caja en tiempo real.${colores.reset}\n`);

        carrito = [];

      } catch (error) {
        limpiar();
        titulo("PEDIDO CANCELADO");
        console.log(`${colores.bgRed}${colores.bright} LO SENTIMOS - PEDIDO CANCELADO: ${colores.reset}`);
        console.log(`\n  ${colores.red}${error.mensaje || error}${colores.reset}\n`);
        console.log(`${colores.yellow}No se realizó ningún cobro. El pedido fue rechazado por control de calidad.${colores.reset}\n`);
      } finally {
        resolveTransaction = null;
        rejectTransaction = null;
      }
    } else {
      console.log(`${colores.red}\n✗ Compra cancelada por el usuario.${colores.reset}\n`);
    }
    rl.question(`${colores.dim}Presiona Enter para volver al menú...${colores.reset}`, () => menuPrincipal());
  });
}

function eliminarDelCarrito(indice) {
  if (isNaN(indice) || indice < 1 || indice > carrito.length) {
    console.log(`${colores.red}✗ Por favor, ingresa un número válido del carrito.${colores.reset}\n`);
    return;
  }

  const producto = carrito[indice - 1];
  carrito.splice(indice - 1, 1);
  console.log(`${colores.green}[OK] ${producto.nombre} eliminado del carrito${colores.reset}\n`);
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    console.log(`${colores.dim}El carrito ya está vacío${colores.reset}\n`);
    return;
  }
  carrito = [];
  console.log(`${colores.green}[OK] Carrito vaciado${colores.reset}\n`);
}

function menuPrincipal() {
  mostrarMenuPrincipal();

  rl.question(`${colores.cyan}Opción: ${colores.reset}`, (opcion) => {
    opcion = opcion.trim();

    switch (opcion) {
      case '1':
        mostrarCatalogo();
        rl.question(`\n${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;

      case '2':
        mostrarProductosDisponibles();
        rl.question(`\n${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;

      case '3':
        mostrarPromociones();
        rl.question(`\n${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;

      case '4':
        rl.question(`${colores.cyan}Buscar por nombre o ID: ${colores.reset}`, (termino) => {
          buscarProducto(termino);
          rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        });
        break;

      case '5':
        rl.question(`${colores.cyan}ID del producto: ${colores.reset}`, (id) => {
          rl.question(`${colores.cyan}Cantidad: ${colores.reset}`, (cantidad) => {
            agregarAlCarrito(id, parseInt(cantidad) || 1);
            rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
          });
        });
        break;

      case '6':
        mostrarCarrito();
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;

      case '7':
        mostrarCarrito();
        if (carrito.length > 0) {
          rl.question(`${colores.cyan}Número del item a eliminar: ${colores.reset}`, (indice) => {
            eliminarDelCarrito(parseInt(indice));
            rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
          });
        } else {
          rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        }
        break;

      case '8':
        procesarCompra();
        break;

      case '9':
        vaciarCarrito();
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;

      case '0':
        limpiar();
        console.log(`\n${colores.green}¡Gracias por visitarnos!${colores.reset}\n`);
        rl.close();
        process.exit(0);
        break;

      default:
        console.log(`${colores.red}[Error] Opcion no valida${colores.reset}\n`);
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
    }
  });
}

function handleSocketMessage(msg) {
  switch (msg.type) {
    case 'PREPARACION_PROGRESO':
      mostrarEstadoVisual(msg.mensaje, colores.yellow, msg.progreso);
      break;

    case 'PEDIDO_CANCELADO':
      if (rejectTransaction) {
        rejectTransaction({ mensaje: msg.motivo });
      }
      break;

    case 'TRANSACCION_COMPLETADA':
      if (resolveTransaction) {
        resolveTransaction(msg.ticket);
      }
      break;

    case 'PEDIDO_INGREDIENTE_FALTANTE':
      const preguntarDecision = () => {
        limpiar();
        titulo("FALTA DE INGREDIENTES REPORTADA");
        console.log(`${colores.bgRed}${colores.white} ATENCION: La cocina reporta falta de ingredientes para tu pedido. ${colores.reset}\n`);
        console.log(`${colores.yellow}${msg.motivo}${colores.reset}\n`);
        console.log(`${colores.cyan}¿Quieres continuar con tu pedido de todos modos?${colores.reset}`);
        console.log(`  ${colores.cyan}1${colores.reset} - Si, continuar`);
        console.log(`  ${colores.cyan}2${colores.reset} - No, cancelar pedido\n`);
        rl.question(`${colores.yellow}Ingresa tu opcion (1/2): ${colores.reset}`, (ans) => {
          const decision = ans.trim();
          if (decision === '1') {
            sendJSON(clientSocket, { type: 'CLIENTE_DECISION', decision: 'continuar' });
            limpiar();
            titulo("ESTADO DEL PEDIDO");
            console.log(`\n  >> Reanudando preparacion en Cocina...\n`);
          } else if (decision === '2') {
            sendJSON(clientSocket, { type: 'CLIENTE_DECISION', decision: 'cancelar' });
          } else {
            preguntarDecision();
          }
        });
      };
      preguntarDecision();
      break;
  }
}

function iniciarConexionYMenu() {
  try {
    iniciarServidorCaja();
  } catch (e) { }
  conectarCajaCentral();
  menuPrincipal();
}

function conectarCajaCentral() {
  const net = require('net');
  if (clientSocket && !clientSocket.destroyed) return;

  clientSocket = net.createConnection({ port: 5001 }, () => {
    sendJSON(clientSocket, { type: 'REGISTRO_CLIENTE', role: 'cliente' });
  });

  clientSocket.on('error', () => {
    if (clientSocket) {
      clientSocket.destroy();
      clientSocket = null;
    }
    setTimeout(conectarCajaCentral, 2000);
  });

  let socketBuffer = '';
  clientSocket.on('data', (data) => {
    socketBuffer += data.toString();
    let boundary = socketBuffer.indexOf('\n');
    while (boundary !== -1) {
      const input = socketBuffer.substring(0, boundary).trim();
      socketBuffer = socketBuffer.substring(boundary + 1);
      if (input) {
        try {
          const msg = JSON.parse(input);
          handleSocketMessage(msg);
        } catch (e) { }
      }
      boundary = socketBuffer.indexOf('\n');
    }
  });

  clientSocket.on('close', () => {
    if (clientSocket) {
      clientSocket.destroy();
      clientSocket = null;
    }
    setTimeout(conectarCajaCentral, 2000);
  });
}

iniciarConexionYMenu();