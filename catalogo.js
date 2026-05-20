const colores = { reset: '\x1b[0m', bright: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m', bgBlue: '\x1b[44m', bgGreen: '\x1b[42m', bgRed: '\x1b[41m' };

const catalogoProductos = {
  productos: [
    { id: 1, nombre: "Frappé de Chocolate", categoria: "Bebida", descripcion: "Delicioso frappé de chocolate con leche condensada y hielo", precio: 5.99, stock: 45 },
    { id: 2, nombre: "Malteada de Fresa", categoria: "Bebida", descripcion: "Malteada fresca de fresa con crema batida y cerezas", precio: 6.50, stock: 35 },
    { id: 3, nombre: "Café Espresso", categoria: "Bebida", descripcion: "Café espresso puro 100% arábica de alta calidad", precio: 3.75, stock: 60 },
    { id: 4, nombre: "Cappuccino Artesanal", categoria: "Bebida", descripcion: "Cappuccino con espuma de leche vaporizada y canela", precio: 4.99, stock: 40 },
    { id: 5, nombre: "Brownie de Chocolate", categoria: "Postre", descripcion: "Brownie casero de chocolate oscuro con nueces", precio: 4.50, stock: 28 },
    { id: 6, nombre: "Cheesecake de Arándanos", categoria: "Postre", descripcion: "Cheesecake cremoso con cobertura de arándanos frescos", precio: 5.75, stock: 18 },
    { id: 7, nombre: "Croissant de Almendra", categoria: "Postre", descripcion: "Croissant crujiente relleno de crema de almendra", precio: 3.99, stock: 50 },
    { id: 8, nombre: "Frappé de Vainilla", categoria: "Bebida", descripcion: "Frappé cremoso de vainilla con topping de chocolate", precio: 5.50, stock: 40 }
  ]
};

function leerTodosProductos() {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} LEER - Todos los Productos ${colores.reset}\n`);
  if (!catalogoProductos.productos.length) return console.log(`${colores.dim}No hay productos${colores.reset}\n`);
  catalogoProductos.productos.forEach(p => console.log(`${colores.yellow}[${p.id}]${colores.reset} ${colores.bright}${p.nombre}${colores.reset} (${p.categoria})\n    ${p.descripcion}\n    ${colores.green}Precio: $${p.precio}${colores.reset} | ${colores.cyan}Stock: ${p.stock}${colores.reset}\n`));
}

function leerProductoPorId(id) {
  const p = catalogoProductos.productos.find(prod => prod.id === id);
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} LEER - Producto ID ${id} ${colores.reset}\n`);
  if (!p) return console.log(`${colores.red}Producto no encontrado${colores.reset}\n`), null;
  console.log(`${colores.yellow}ID:${colores.reset} ${p.id}\n${colores.yellow}Nombre:${colores.reset} ${colores.bright}${p.nombre}${colores.reset}\n${colores.yellow}Categoría:${colores.reset} ${p.categoria}\n${colores.yellow}Descripción:${colores.reset} ${p.descripcion}\n${colores.yellow}Precio:${colores.reset} ${colores.green}$${p.precio}${colores.reset}\n${colores.yellow}Stock:${colores.reset} ${colores.cyan}${p.stock} unidades${colores.reset}\n`);
  return p;
}

function crearProducto(nombre, categoria, descripcion, precio, stock) {
  console.log(`\n${colores.bgGreen}${colores.cyan}${colores.bright} CREATE - Crear Nuevo Producto ${colores.reset}\n`);
  if (!nombre?.trim()) return console.log(`${colores.red}El nombre es requerido${colores.reset}\n`), null;
  if (precio < 0 || isNaN(precio)) return console.log(`${colores.red}El precio debe ser válido${colores.reset}\n`), null;
  if (stock < 0 || !Number.isInteger(stock)) return console.log(`${colores.red}El stock debe ser un número entero${colores.reset}\n`), null;

  const nuevoId = Math.max(...catalogoProductos.productos.map(p => p.id), 0) + 1;
  const nuevo = { id: nuevoId, nombre, categoria: categoria || "Bebida", descripcion: descripcion || "Sin descripción", precio: parseFloat(precio), stock: parseInt(stock) };
  catalogoProductos.productos.push(nuevo);
  console.log(`${colores.green}Producto creado exitosamente${colores.reset}\n${colores.yellow}ID asignado:${colores.reset} ${nuevoId}\n${colores.yellow}Nombre:${colores.reset} ${colores.bright}${nuevo.nombre}${colores.reset}\n`);
  return nuevo;
}

function actualizarProducto(id, actualizaciones) {
  console.log(`\n${colores.bgBlue}${colores.bright} UPDATE - Actualizar Producto ID ${id} ${colores.reset}\n`);
  const p = catalogoProductos.productos.find(prod => prod.id === id);
  if (!p) return console.log(`${colores.red}Producto no encontrado${colores.reset}\n`), null;

  const ant = { ...p };
  if (actualizaciones.nombre !== undefined) p.nombre = actualizaciones.nombre;
  if (actualizaciones.categoria !== undefined) p.categoria = actualizaciones.categoria;
  if (actualizaciones.descripcion !== undefined) p.descripcion = actualizaciones.descripcion;
  if (actualizaciones.precio !== undefined) {
    if (actualizaciones.precio < 0) return console.log(`${colores.red}El precio no puede ser negativo${colores.reset}\n`), null;
    p.precio = parseFloat(actualizaciones.precio);
  }
  if (actualizaciones.stock !== undefined) {
    if (actualizaciones.stock < 0 || !Number.isInteger(actualizaciones.stock)) return console.log(`${colores.red}El stock debe ser entero no negativo${colores.reset}\n`), null;
    p.stock = parseInt(actualizaciones.stock);
  }

  console.log(`${colores.green}Producto actualizado${colores.reset}\n\n${colores.yellow}Cambios realizados:${colores.reset}`);
  if (actualizaciones.nombre !== undefined) console.log(`  • Nombre: ${colores.dim}${ant.nombre}${colores.reset} → ${colores.bright}${p.nombre}${colores.reset}`);
  if (actualizaciones.precio !== undefined) console.log(`  • Precio: ${colores.dim}$${ant.precio}${colores.reset} → ${colores.green}$${p.precio}${colores.reset}`);
  if (actualizaciones.stock !== undefined) console.log(`  • Stock: ${colores.dim}${ant.stock}${colores.reset} → ${colores.cyan}${p.stock}${colores.reset}`);
  console.log();
  return p;
}

function eliminarProducto(id) {
  console.log(`\n${colores.bgRed}${colores.bright} DELETE - Eliminar Producto ID ${id} ${colores.reset}\n`);
  const idx = catalogoProductos.productos.findIndex(p => p.id === id);
  if (idx === -1) return console.log(`${colores.red}Producto no encontrado${colores.reset}\n`), null;

  const eliminado = catalogoProductos.productos.splice(idx, 1)[0];
  console.log(`${colores.green}Producto eliminado${colores.reset}\n${colores.yellow}Producto:${colores.reset} ${colores.bright}${eliminado.nombre}${colores.reset}\n${colores.yellow}ID:${colores.reset} ${eliminado.id}\n`);
  return eliminado;
}

const contarProductos = () => catalogoProductos.productos.length;
const calcularValorTotalInventario = () => catalogoProductos.productos.reduce((t, p) => t + (p.precio * p.stock), 0);

function productosConStockBajo(minimo = 20) {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} PRODUCTOS CON STOCK BAJO (< ${minimo}) ${colores.reset}\n`);
  const bajo = catalogoProductos.productos.filter(p => p.stock < minimo);
  if (!bajo.length) return console.log(`${colores.green}Todos los productos tienen stock suficiente${colores.reset}\n`);
  bajo.forEach(p => console.log(`${colores.red}!${colores.reset} ${colores.bright}${p.nombre}${colores.reset}\n   Stock actual: ${colores.yellow}${p.stock}${colores.reset} unidades\n`));
}

function mostrarResumen() {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} RESUMEN DEL CATÁLOGO ${colores.reset}\n`);
  console.log(`${colores.yellow}Total de productos:${colores.reset} ${contarProductos()}\n${colores.yellow}Valor total inventario:${colores.reset} ${colores.green}$${calcularValorTotalInventario().toFixed(2)}${colores.reset}\n${colores.yellow}Total de unidades:${colores.reset} ${colores.cyan}${catalogoProductos.productos.reduce((s, p) => s + p.stock, 0)}${colores.reset}\n${colores.yellow}Precio promedio:${colores.reset} ${colores.green}$${(catalogoProductos.productos.reduce((s, p) => s + p.precio, 0) / contarProductos()).toFixed(2)}${colores.reset}\n`);
}

const productosBaratos = (limite = 4.50) => { console.log(`\n${colores.bgBlue}${colores.bright} PRODUCTOS BARATOS (<= $${limite}) ${colores.reset}\n`); catalogoProductos.productos.filter(p => p.precio <= limite).forEach(p => console.log(`- ${p.nombre}: $${p.precio}`)); };
const productosCaros = (limite = 5.00) => { console.log(`\n${colores.bgBlue}${colores.bright} PRODUCTOS CAROS (>= $${limite}) ${colores.reset}\n`); catalogoProductos.productos.filter(p => p.precio >= limite).forEach(p => console.log(`- ${p.nombre}: $${p.precio}`)); };
const bebidas = () => { console.log(`\n${colores.bgBlue}${colores.bright} LISTA DE BEBIDAS ${colores.reset}\n`); catalogoProductos.productos.filter(p => p.categoria === "Bebida").forEach(p => console.log(`- ${p.nombre}`)); };
const postres = () => { console.log(`\n${colores.bgBlue}${colores.bright} LISTA DE POSTRES ${colores.reset}\n`); catalogoProductos.productos.filter(p => p.categoria === "Postre").forEach(p => console.log(`- ${p.nombre}`)); };

let rl;
if (require.main === module) rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });

const pausa = () => rl.question(`\n${colores.dim}Presiona Enter para continuar...${colores.reset}`, () => mostrarMenuCRUD());

function mostrarMenuCRUD() {
  console.clear();
  console.log(`--- MENU DE ADMINISTRACION ---\n  1 - Leer todos los productos (READ)\n  2 - Leer producto por ID (READ)\n  3 - Crear nuevo producto (CREATE)\n  4 - Actualizar producto (UPDATE)\n  5 - Eliminar producto (DELETE)\n  6 - Mostrar resumen del catálogo\n  7 - Productos con stock bajo\n  8 - Ver productos baratos\n  9 - Ver productos caros\n  10 - Ver solo bebidas\n  11 - Ver solo postres\n  0 - Salir\n`);

  rl.question(`Selecciona una opción: `, (opcion) => {
    switch (opcion.trim()) {
      case '1': console.clear(); leerTodosProductos(); pausa(); break;
      case '2': rl.question(`Ingresa el ID: `, id => { console.clear(); leerProductoPorId(parseInt(id)); pausa(); }); break;
      case '3': rl.question(`Nombre: `, n => rl.question(`Categoría (Bebida/Postre): `, c => rl.question(`Descripción: `, d => rl.question(`Precio: `, p => rl.question(`Stock: `, s => { console.clear(); crearProducto(n, c, d, parseFloat(p), parseInt(s)); pausa(); }))))); break;
      case '4':
        rl.question(`ID a actualizar: `, id => {
          const p = catalogoProductos.productos.find(prod => prod.id === parseInt(id));
          if (!p) return console.clear(), console.log(`${colores.red}Producto no encontrado${colores.reset}\n`), pausa();
          console.log(`${colores.dim}(Dejar en blanco para conservar actual)${colores.reset}`);
          rl.question(`Nombre [${p.nombre}]: `, n => rl.question(`Categoría [${p.categoria}]: `, c => rl.question(`Descripción [${p.descripcion}]: `, d => rl.question(`Precio [${p.precio}]: `, pr => rl.question(`Stock [${p.stock}]: `, st => {
            console.clear(); const up = {}; if (n.trim()) up.nombre = n; if (c.trim()) up.categoria = c; if (d.trim()) up.descripcion = d; if (pr.trim()) up.precio = parseFloat(pr); if (st.trim()) up.stock = parseInt(st);
            Object.keys(up).length ? actualizarProducto(parseInt(id), up) : console.log(`${colores.yellow}No se realizaron cambios.${colores.reset}\n`); pausa();
          })))));
        });
        break;
      case '5': rl.question(`ID a eliminar: `, id => { console.clear(); eliminarProducto(parseInt(id)); pausa(); }); break;
      case '6': console.clear(); mostrarResumen(); pausa(); break;
      case '7': rl.question(`Stock mínimo [20]: `, m => { console.clear(); productosConStockBajo(m.trim() ? parseInt(m) : 20); pausa(); }); break;
      case '8': console.clear(); productosBaratos(); pausa(); break;
      case '9': console.clear(); productosCaros(); pausa(); break;
      case '10': console.clear(); bebidas(); pausa(); break;
      case '11': console.clear(); postres(); pausa(); break;
      case '0': console.clear(); console.log(`\n${colores.green}Saliendo del sistema...${colores.reset}\n`); rl.close(); break;
      default: console.log(`${colores.red}Opción no válida${colores.reset}\n`); pausa();
    }
  });
}

if (require.main === module) setTimeout(() => mostrarMenuCRUD(), 500);
if (typeof module !== 'undefined' && module.exports) module.exports = { catalogoProductos, leerTodosProductos, leerProductoPorId, crearProducto, actualizarProducto, eliminarProducto, mostrarResumen, productosConStockBajo, contarProductos, calcularValorTotalInventario, productosBaratos, productosCaros, bebidas, postres };