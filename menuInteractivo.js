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

const { catalogoProductos } = require('./catalogo.js');
const { procesarCompraEnCaja } = require('./caja.js');

let carrito = [];

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
    ☕ ╔═══════════════════════════════════════════════╗ ☕
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
  
  console.log(`${colores.green}✓ ${producto.nombre} agregado al carrito${colores.reset}\n`);
  return true;
}

function procesarCompra() {
  if (carrito.length === 0) {
    console.log(`${colores.red}✗ El carrito está vacío${colores.reset}\n`);
    return;
  }
  
  limpiar();
  titulo("RESUMEN DE COMPRA");
  
  carrito.forEach((item) => {
    const productoOriginal = catalogoProductos.productos.find(p => p.id === item.id);
    if (productoOriginal) {
      productoOriginal.stock -= item.cantidad;
    }
  });
  
  procesarCompraEnCaja(carrito);
  
  console.log(`${colores.bright}${colores.bgGreen}${colores.cyan} ✓ ¡COMPRA REALIZADA EXITOSAMENTE! ${colores.reset}\n`);
  
  carrito = [];
}

function eliminarDelCarrito(indice) {
  if (isNaN(indice) || indice < 1 || indice > carrito.length) {
    console.log(`${colores.red}✗ Por favor, ingresa un número válido del carrito.${colores.reset}\n`);
    return;
  }
  
  const producto = carrito[indice - 1];
  carrito.splice(indice - 1, 1);
  console.log(`${colores.green}✓ ${producto.nombre} eliminado del carrito${colores.reset}\n`);
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    console.log(`${colores.dim}El carrito ya está vacío${colores.reset}\n`);
    return;
  }
  carrito = [];
  console.log(`${colores.green}✓ Carrito vaciado${colores.reset}\n`);
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
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;
        
      case '9':
        vaciarCarrito();
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;
        
      case '0':
        limpiar();
        console.log(`\n${colores.green}✓ ¡Gracias por visitarnos!${colores.reset}\n`);
        rl.close();
        process.exit(0);
        break;
        
      default:
        console.log(`${colores.red}✗ Opción no válida${colores.reset}\n`);
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
    }
  });
}

limpiar();
console.log(`${colores.bright}${colores.green}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║         ☕ CAFÉ & DELICIAS - MENÚ INTERACTIVO ☕         ║
║                                                          ║
║   Cargando sistema...                                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
${colores.reset}`);

setTimeout(() => {
  menuPrincipal();
}, 500);
