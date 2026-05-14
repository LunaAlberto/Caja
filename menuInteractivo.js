// ═══════════════════════════════════════════════════════════════
//    MENÚ INTERACTIVO CON ENTRADA DEL USUARIO - CAFETERÍA
// ═══════════════════════════════════════════════════════════════

const readline = require('readline');

// COLORES ANSI
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

let carrito = [];

// INTERFAZ READLINE
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// FUNCIONES AUXILIARES
function limpiar() {
  console.clear();
}

function titulo(texto) {
  console.log(`\n${colores.bgBlue}${colores.bright}${colores.cyan} ${texto.padEnd(60)} ${colores.reset}\n`);
}

function separador() {
  console.log(`${colores.dim}${'═'.repeat(65)}${colores.reset}\n`);
}

function mostrarCatalogo() {
  limpiar();
  titulo("CATÁLOGO DE PRODUCTOS");
  
  catalogoProductos.productos.forEach(p => {
    console.log(`  ${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset}`);
    console.log(`      ${p.descripcion}`);
    console.log(`      ${colores.green}$${p.precio}${colores.reset} | ${colores.dim}Stock: ${p.stock}${colores.reset}\n`);
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
  console.log(`  ${colores.cyan}1${colores.reset} - Ver catálogo`);
  console.log(`  ${colores.cyan}2${colores.reset} - Buscar producto`);
  console.log(`  ${colores.cyan}3${colores.reset} - Agregar al carrito`);
  console.log(`  ${colores.cyan}4${colores.reset} - Ver carrito`);
  console.log(`  ${colores.cyan}5${colores.reset} - Eliminar del carrito`);
  console.log(`  ${colores.cyan}6${colores.reset} - Procesar compra`);
  console.log(`  ${colores.cyan}7${colores.reset} - Vaciar carrito`);
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
    console.log(`   Cantidad: ${colores.yellow}${item.cantidad}${colores.reset} x ${colores.green}$${item.precio}${colores.reset} = ${colores.green}$${subtotal.toFixed(2)}${colores.reset}\n`);
  });
  
  separador();
  console.log(`${colores.bright}${colores.green}TOTAL: $${total.toFixed(2)}${colores.reset}\n`);
}

function buscarProducto(termino) {
  const resultado = catalogoProductos.productos.filter(p =>
    p.nombre.toLowerCase().includes(termino.toLowerCase()) || String(p.id) === termino
  );
  
  limpiar();
  
  if (resultado.length === 0) {
    console.log(`${colores.red}✗ No se encontraron productos${colores.reset}\n`);
    return;
  }
  
  titulo(`RESULTADOS DE BÚSQUEDA: "${termino}"`);
  
  resultado.forEach(p => {
    console.log(`  ${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset}`);
    console.log(`      ${p.descripcion}`);
    console.log(`      ${colores.green}$${p.precio}${colores.reset} | ${colores.dim}Stock: ${p.stock}${colores.reset}\n`);
  });
}

function agregarAlCarrito(idProducto, cantidad) {
  const producto = catalogoProductos.productos.find(p => p.id === parseInt(idProducto));
  
  if (!producto) {
    console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
    return false;
  }
  
  if (cantidad > producto.stock) {
    console.log(`${colores.red}✗ Stock insuficiente. Disponibles: ${producto.stock}${colores.reset}\n`);
    return false;
  }
  
  const itemEnCarrito = carrito.find(item => item.id === producto.id);
  
  if (itemEnCarrito) {
    itemEnCarrito.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
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
  
  let total = 0;
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    console.log(`${index + 1}. ${item.nombre} x${item.cantidad} = ${colores.green}$${subtotal.toFixed(2)}${colores.reset}`);
  });
  
  separador();
  console.log(`${colores.bright}${colores.green}TOTAL A PAGAR: $${total.toFixed(2)}${colores.reset}\n`);
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

// MENÚ PRINCIPAL INTERACTIVO
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
        rl.question(`${colores.cyan}Buscar por nombre o ID: ${colores.reset}`, (termino) => {
          buscarProducto(termino);
          rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        });
        break;
        
      case '3':
        rl.question(`${colores.cyan}ID del producto: ${colores.reset}`, (id) => {
          rl.question(`${colores.cyan}Cantidad: ${colores.reset}`, (cantidad) => {
            agregarAlCarrito(id, parseInt(cantidad) || 1);
            rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
          });
        });
        break;
        
      case '4':
        mostrarCarrito();
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;
        
      case '5':
        mostrarCarrito();
        rl.question(`${colores.cyan}Número del item a eliminar: ${colores.reset}`, (indice) => {
          eliminarDelCarrito(parseInt(indice));
          rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        });
        break;
        
      case '6':
        procesarCompra();
        rl.question(`${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => menuPrincipal());
        break;
        
      case '7':
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

// INICIAR
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
