// ═══════════════════════════════════════════════════════════════
//         CRUD DE PRODUCTOS DE CAFETERÍA
//    (Create, Read, Update, Delete - Gestión de Inventario)
// ═══════════════════════════════════════════════════════════════

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
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m'
};

// OBJETO PRINCIPAL - BASE DE DATOS
const catalogoProductos = {
  productos: [
    {
      id: 1,
      nombre: "Frappé de Chocolate",
      descripcion: "Delicioso frappé de chocolate con leche condensada y hielo",
      precio: 5.99,
      stock: 45
    },
    {
      id: 2,
      nombre: "Malteada de Fresa",
      descripcion: "Malteada fresca de fresa con crema batida y cerezas",
      precio: 6.50,
      stock: 35
    },
    {
      id: 3,
      nombre: "Café Espresso",
      descripcion: "Café espresso puro 100% arábica de alta calidad",
      precio: 3.75,
      stock: 60
    },
    {
      id: 4,
      nombre: "Cappuccino Artesanal",
      descripcion: "Cappuccino con espuma de leche vaporizada y canela",
      precio: 4.99,
      stock: 40
    },
    {
      id: 5,
      nombre: "Brownie de Chocolate",
      descripcion: "Brownie casero de chocolate oscuro con nueces",
      precio: 4.50,
      stock: 28
    },
    {
      id: 6,
      nombre: "Cheesecake de Arándanos",
      descripcion: "Cheesecake cremoso con cobertura de arándanos frescos",
      precio: 5.75,
      stock: 18
    },
    {
      id: 7,
      nombre: "Croissant de Almendra",
      descripcion: "Croissant crujiente relleno de crema de almendra",
      precio: 3.99,
      stock: 50
    },
    {
      id: 8,
      nombre: "Frappé de Vainilla",
      descripcion: "Frappé cremoso de vainilla con topping de chocolate",
      precio: 5.50,
      stock: 40
    }
  ]
};

// ════════════════════════════════════════════════════════════════
//                    FUNCIONES CRUD
// ════════════════════════════════════════════════════════════════

// ─── READ ───────────────────────────────────────────────────────
// Leer todos los productos
function leerTodosProductos() {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} LEER - Todos los Productos ${colores.reset}\n`);
  
  if (catalogoProductos.productos.length === 0) {
    console.log(`${colores.dim}No hay productos en el catálogo${colores.reset}\n`);
    return;
  }
  
  catalogoProductos.productos.forEach((producto, index) => {
    console.log(`${colores.yellow}[${producto.id}]${colores.reset} ${colores.bright}${producto.nombre}${colores.reset}`);
    console.log(`    ${producto.descripcion}`);
    console.log(`    ${colores.green}Precio: $${producto.precio}${colores.reset} | ${colores.cyan}Stock: ${producto.stock}${colores.reset}\n`);
  });
}

// Leer un producto por ID
function leerProductoPorId(id) {
  const producto = catalogoProductos.productos.find(p => p.id === id);
  
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} LEER - Producto ID ${id} ${colores.reset}\n`);
  
  if (!producto) {
    console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
    return null;
  }
  
  console.log(`${colores.yellow}ID:${colores.reset} ${producto.id}`);
  console.log(`${colores.yellow}Nombre:${colores.reset} ${colores.bright}${producto.nombre}${colores.reset}`);
  console.log(`${colores.yellow}Descripción:${colores.reset} ${producto.descripcion}`);
  console.log(`${colores.yellow}Precio:${colores.reset} ${colores.green}$${producto.precio}${colores.reset}`);
  console.log(`${colores.yellow}Stock:${colores.reset} ${colores.cyan}${producto.stock} unidades${colores.reset}\n`);
  
  return producto;
}

// ─── CREATE ─────────────────────────────────────────────────────
// Crear un nuevo producto
function crearProducto(nombre, descripcion, precio, stock) {
  console.log(`\n${colores.bgGreen}${colores.cyan}${colores.bright} CREATE - Crear Nuevo Producto ${colores.reset}\n`);
  
  // Validaciones
  if (!nombre || nombre.trim() === '') {
    console.log(`${colores.red}✗ El nombre es requerido${colores.reset}\n`);
    return null;
  }
  
  if (precio < 0 || isNaN(precio)) {
    console.log(`${colores.red}✗ El precio debe ser válido${colores.reset}\n`);
    return null;
  }
  
  if (stock < 0 || !Number.isInteger(stock)) {
    console.log(`${colores.red}✗ El stock debe ser un número entero${colores.reset}\n`);
    return null;
  }
  
  // Generar ID automáticamente
  const nuevoId = Math.max(...catalogoProductos.productos.map(p => p.id), 0) + 1;
  
  // Crear objeto del producto
  const nuevoProducto = {
    id: nuevoId,
    nombre: nombre,
    descripcion: descripcion || "Sin descripción",
    precio: parseFloat(precio),
    stock: parseInt(stock)
  };
  
  // Agregar al array
  catalogoProductos.productos.push(nuevoProducto);
  
  console.log(`${colores.green}✓ Producto creado exitosamente${colores.reset}`);
  console.log(`${colores.yellow}ID asignado:${colores.reset} ${nuevoId}`);
  console.log(`${colores.yellow}Nombre:${colores.reset} ${colores.bright}${nuevoProducto.nombre}${colores.reset}\n`);
  
  return nuevoProducto;
}

// ─── UPDATE ─────────────────────────────────────────────────────
// Actualizar un producto
function actualizarProducto(id, actualizaciones) {
  console.log(`\n${colores.bgBlue}${colores.bright} UPDATE - Actualizar Producto ID ${id} ${colores.reset}\n`);
  
  const producto = catalogoProductos.productos.find(p => p.id === id);
  
  if (!producto) {
    console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
    return null;
  }
  
  // Guardar valores anteriores
  const valoresAnteriores = { ...producto };
  
  // Actualizar solo los campos proporcionados
  if (actualizaciones.nombre !== undefined) {
    producto.nombre = actualizaciones.nombre;
  }
  if (actualizaciones.descripcion !== undefined) {
    producto.descripcion = actualizaciones.descripcion;
  }
  if (actualizaciones.precio !== undefined) {
    if (actualizaciones.precio < 0) {
      console.log(`${colores.red}✗ El precio no puede ser negativo${colores.reset}\n`);
      return null;
    }
    producto.precio = parseFloat(actualizaciones.precio);
  }
  if (actualizaciones.stock !== undefined) {
    if (actualizaciones.stock < 0 || !Number.isInteger(actualizaciones.stock)) {
      console.log(`${colores.red}✗ El stock debe ser un número entero no negativo${colores.reset}\n`);
      return null;
    }
    producto.stock = parseInt(actualizaciones.stock);
  }
  
  console.log(`${colores.green}✓ Producto actualizado${colores.reset}\n`);
  console.log(`${colores.yellow}Cambios realizados:${colores.reset}`);
  
  if (actualizaciones.nombre !== undefined) {
    console.log(`  • Nombre: ${colores.dim}${valoresAnteriores.nombre}${colores.reset} → ${colores.bright}${producto.nombre}${colores.reset}`);
  }
  if (actualizaciones.precio !== undefined) {
    console.log(`  • Precio: ${colores.dim}$${valoresAnteriores.precio}${colores.reset} → ${colores.green}$${producto.precio}${colores.reset}`);
  }
  if (actualizaciones.stock !== undefined) {
    console.log(`  • Stock: ${colores.dim}${valoresAnteriores.stock}${colores.reset} → ${colores.cyan}${producto.stock}${colores.reset}`);
  }
  console.log();
  
  return producto;
}

// ─── DELETE ─────────────────────────────────────────────────────
// Eliminar un producto
function eliminarProducto(id) {
  console.log(`\n${colores.bgRed}${colores.bright} DELETE - Eliminar Producto ID ${id} ${colores.reset}\n`);
  
  const indice = catalogoProductos.productos.findIndex(p => p.id === id);
  
  if (indice === -1) {
    console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
    return null;
  }
  
  const productoEliminado = catalogoProductos.productos.splice(indice, 1)[0];
  
  console.log(`${colores.green}✓ Producto eliminado${colores.reset}`);
  console.log(`${colores.yellow}Producto:${colores.reset} ${colores.bright}${productoEliminado.nombre}${colores.reset}`);
  console.log(`${colores.yellow}ID:${colores.reset} ${productoEliminado.id}\n`);
  
  return productoEliminado;
}

// ─── FUNCIONES AUXILIARES ───────────────────────────────────────
// Obtener cantidad de productos
function contarProductos() {
  return catalogoProductos.productos.length;
}

// Obtener valor total del inventario
function calcularValorTotalInventario() {
  return catalogoProductos.productos.reduce((total, producto) => {
    return total + (producto.precio * producto.stock);
  }, 0);
}

// Mostrar productos con stock bajo
function productosConStockBajo(minimo = 20) {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} PRODUCTOS CON STOCK BAJO (< ${minimo}) ${colores.reset}\n`);
  
  const stockBajo = catalogoProductos.productos.filter(p => p.stock < minimo);
  
  if (stockBajo.length === 0) {
    console.log(`${colores.green}✓ Todos los productos tienen stock suficiente${colores.reset}\n`);
    return;
  }
  
  stockBajo.forEach(producto => {
    console.log(`${colores.red}⚠${colores.reset} ${colores.bright}${producto.nombre}${colores.reset}`);
    console.log(`   Stock actual: ${colores.yellow}${producto.stock}${colores.reset} unidades\n`);
  });
}

// Mostrar resumen del catálogo
function mostrarResumen() {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} RESUMEN DEL CATÁLOGO ${colores.reset}\n`);
  
  console.log(`${colores.yellow}Total de productos:${colores.reset} ${contarProductos()}`);
  console.log(`${colores.yellow}Valor total inventario:${colores.reset} ${colores.green}$${calcularValorTotalInventario().toFixed(2)}${colores.reset}`);
  
  const stockTotal = catalogoProductos.productos.reduce((sum, p) => sum + p.stock, 0);
  console.log(`${colores.yellow}Total de unidades:${colores.reset} ${colores.cyan}${stockTotal}${colores.reset}`);
  
  const precioPromedio = (catalogoProductos.productos.reduce((sum, p) => sum + p.precio, 0) / contarProductos()).toFixed(2);
  console.log(`${colores.yellow}Precio promedio:${colores.reset} ${colores.green}$${precioPromedio}${colores.reset}\n`);
}

// ════════════════════════════════════════════════════════════════
//                    MENÚ INTERACTIVO DEL CRUD
// ════════════════════════════════════════════════════════════════

let rl;
if (require.main === module) {
  const readline = require('readline');
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function pausa() {
  rl.question(`\n${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => {
    mostrarMenuCRUD();
  });
}

function mostrarMenuCRUD() {
  console.clear();
  console.log(`
${colores.bright}${colores.cyan}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        ☕ CRUD - GESTIÓN DE CAFETERÍA ☕                 ║
║                                                           ║
║     Menú Interactivo de Administración                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colores.reset}`);

  console.log(`  ${colores.cyan}1${colores.reset} - Leer todos los productos (READ)`);
  console.log(`  ${colores.cyan}2${colores.reset} - Leer producto por ID (READ)`);
  console.log(`  ${colores.cyan}3${colores.reset} - Crear nuevo producto (CREATE)`);
  console.log(`  ${colores.cyan}4${colores.reset} - Actualizar producto (UPDATE)`);
  console.log(`  ${colores.cyan}5${colores.reset} - Eliminar producto (DELETE)`);
  console.log(`  ${colores.cyan}6${colores.reset} - Mostrar resumen del catálogo`);
  console.log(`  ${colores.cyan}7${colores.reset} - Productos con stock bajo`);
  console.log(`  ${colores.cyan}0${colores.reset} - Salir\n`);

  rl.question(`${colores.cyan}Selecciona una opción: ${colores.reset}`, (opcion) => {
    switch (opcion.trim()) {
      case '1':
        console.clear();
        leerTodosProductos();
        pausa();
        break;
      case '2':
        rl.question(`${colores.cyan}Ingresa el ID del producto: ${colores.reset}`, (id) => {
          console.clear();
          leerProductoPorId(parseInt(id));
          pausa();
        });
        break;
      case '3':
        rl.question(`${colores.cyan}Nombre del producto: ${colores.reset}`, (nombre) => {
          rl.question(`${colores.cyan}Descripción: ${colores.reset}`, (descripcion) => {
            rl.question(`${colores.cyan}Precio: ${colores.reset}`, (precio) => {
              rl.question(`${colores.cyan}Stock: ${colores.reset}`, (stock) => {
                console.clear();
                crearProducto(nombre, descripcion, parseFloat(precio), parseInt(stock));
                pausa();
              });
            });
          });
        });
        break;
      case '4':
        rl.question(`${colores.cyan}ID del producto a actualizar: ${colores.reset}`, (id) => {
          const producto = catalogoProductos.productos.find(p => p.id === parseInt(id));
          if (!producto) {
            console.clear();
            console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
            pausa();
            return;
          }
          console.log(`${colores.dim}(Deja en blanco para no modificar el valor actual)${colores.reset}`);
          rl.question(`${colores.cyan}Nuevo nombre [${producto.nombre}]: ${colores.reset}`, (nombre) => {
            rl.question(`${colores.cyan}Nueva descripción [${producto.descripcion}]: ${colores.reset}`, (descripcion) => {
              rl.question(`${colores.cyan}Nuevo precio [${producto.precio}]: ${colores.reset}`, (precio) => {
                rl.question(`${colores.cyan}Nuevo stock [${producto.stock}]: ${colores.reset}`, (stock) => {
                  console.clear();
                  const actualizaciones = {};
                  if (nombre.trim() !== '') actualizaciones.nombre = nombre;
                  if (descripcion.trim() !== '') actualizaciones.descripcion = descripcion;
                  if (precio.trim() !== '') actualizaciones.precio = parseFloat(precio);
                  if (stock.trim() !== '') actualizaciones.stock = parseInt(stock);
                  
                  if (Object.keys(actualizaciones).length > 0) {
                    actualizarProducto(parseInt(id), actualizaciones);
                  } else {
                    console.log(`${colores.yellow}No se realizaron cambios.${colores.reset}\n`);
                  }
                  pausa();
                });
              });
            });
          });
        });
        break;
      case '5':
        rl.question(`${colores.cyan}ID del producto a eliminar: ${colores.reset}`, (id) => {
          console.clear();
          eliminarProducto(parseInt(id));
          pausa();
        });
        break;
      case '6':
        console.clear();
        mostrarResumen();
        pausa();
        break;
      case '7':
        rl.question(`${colores.cyan}Stock mínimo a evaluar [20]: ${colores.reset}`, (minimo) => {
          console.clear();
          const limite = minimo.trim() !== '' ? parseInt(minimo) : 20;
          productosConStockBajo(limite);
          pausa();
        });
        break;
      case '0':
        console.clear();
        console.log(`\n${colores.green}✓ Saliendo del sistema de gestión...${colores.reset}\n`);
        rl.close();
        break;
      default:
        console.log(`${colores.red}✗ Opción no válida${colores.reset}\n`);
        pausa();
    }
  });
}

// Iniciar el menú interactivo
if (require.main === module) {
  setTimeout(() => {
    mostrarMenuCRUD();
  }, 500);
}

// Exportar para usar como módulo (opcional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    catalogoProductos,
    leerTodosProductos,
    leerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    mostrarResumen,
    productosConStockBajo,
    contarProductos,
    calcularValorTotalInventario
  };
}

