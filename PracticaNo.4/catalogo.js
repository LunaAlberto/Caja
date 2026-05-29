const colores = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m'
};

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

/* =========================================================
   CRUD ORIGINAL
   ========================================================= */

function leerTodosProductos() {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} LEER - Todos los Productos ${colores.reset}\n`);

  if (catalogoProductos.productos.length === 0) {
    console.log(`${colores.dim}No hay productos en el catálogo${colores.reset}\n`);
    return;
  }

  catalogoProductos.productos.forEach((producto) => {
    console.log(`${colores.yellow}[${producto.id}]${colores.reset} ${colores.bright}${producto.nombre}${colores.reset}`);
    console.log(`    ${producto.descripcion}`);
    console.log(`    ${colores.green}Precio: $${producto.precio.toFixed(2)}${colores.reset} | ${colores.cyan}Stock: ${producto.stock}${colores.reset}\n`);
  });
}

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
  console.log(`${colores.yellow}Precio:${colores.reset} ${colores.green}$${producto.precio.toFixed(2)}${colores.reset}`);
  console.log(`${colores.yellow}Stock:${colores.reset} ${colores.cyan}${producto.stock} unidades${colores.reset}\n`);

  return producto;
}

function crearProducto(nombre, categoria, descripcion, precio, stock) {
  console.log(`\n${colores.bgGreen}${colores.cyan}${colores.bright} CREATE - Crear Nuevo Producto ${colores.reset}\n`);

  if (!nombre || nombre.trim() === '') {
    console.log(`${colores.red}✗ El nombre es requerido${colores.reset}\n`);
    return null;
  }

  if (precio < 0 || isNaN(precio)) {
    console.log(`${colores.red}✗ El precio debe ser válido${colores.reset}\n`);
    return null;
  }

  if (stock < 0 || !Number.isInteger(stock)) {
    console.log(`${colores.red}✗ El stock debe ser un número entero no negativo${colores.reset}\n`);
    return null;
  }

  const nuevoId = Math.max(...catalogoProductos.productos.map(p => p.id), 0) + 1;

  const nuevoProducto = {
    id: nuevoId,
    nombre: nombre,
    categoria: categoria || "Bebida",
    descripcion: descripcion || "Sin descripción",
    precio: parseFloat(precio),
    stock: parseInt(stock)
  };

  catalogoProductos.productos.push(nuevoProducto);

  console.log(`${colores.green}✓ Producto creado exitosamente${colores.reset}`);
  console.log(`${colores.yellow}ID asignado:${colores.reset} ${nuevoId}`);
  console.log(`${colores.yellow}Nombre:${colores.reset} ${colores.bright}${nuevoProducto.nombre}${colores.reset}\n`);

  return nuevoProducto;
}

function actualizarProducto(id, actualizaciones) {
  console.log(`\n${colores.bgBlue}${colores.bright} UPDATE - Actualizar Producto ID ${id} ${colores.reset}\n`);

  const producto = catalogoProductos.productos.find(p => p.id === id);

  if (!producto) {
    console.log(`${colores.red}✗ Producto no encontrado${colores.reset}\n`);
    return null;
  }

  const valoresAnteriores = { ...producto };

  if (actualizaciones.nombre !== undefined) {
    producto.nombre = actualizaciones.nombre;
  }
  if (actualizaciones.categoria !== undefined) {
    producto.categoria = actualizaciones.categoria;
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
  if (actualizaciones.categoria !== undefined) {
    console.log(`  • Categoría: ${colores.dim}${valoresAnteriores.categoria}${colores.reset} → ${colores.bright}${producto.categoria}${colores.reset}`);
  }
  if (actualizaciones.precio !== undefined) {
    console.log(`  • Precio: ${colores.dim}$${valoresAnteriores.precio}${colores.reset} → ${colores.green}$${producto.precio.toFixed(2)}${colores.reset}`);
  }
  if (actualizaciones.stock !== undefined) {
    console.log(`  • Stock: ${colores.dim}${valoresAnteriores.stock}${colores.reset} → ${colores.cyan}${producto.stock}${colores.reset}`);
  }
  console.log();

  return producto;
}

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

const contarProductos = () => catalogoProductos.productos.length;

const calcularValorTotalInventario = () =>
  catalogoProductos.productos.reduce((t, p) => t + (p.precio * p.stock), 0);

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

function mostrarResumen() {
  console.log(`\n${colores.bgBlue}${colores.cyan}${colores.bright} RESUMEN DEL CATÁLOGO ${colores.reset}\n`);

  console.log(`${colores.yellow}Total de productos:${colores.reset} ${contarProductos()}`);
  console.log(`${colores.yellow}Valor total inventario:${colores.reset} ${colores.green}$${calcularValorTotalInventario().toFixed(2)}${colores.reset}`);

  const stockTotal = catalogoProductos.productos.reduce((sum, p) => sum + p.stock, 0);
  console.log(`${colores.yellow}Total de unidades:${colores.reset} ${colores.cyan}${stockTotal}${colores.reset}`);

  const precioPromedio = (catalogoProductos.productos.reduce((sum, p) => sum + p.precio, 0) / contarProductos()).toFixed(2);
  console.log(`${colores.yellow}Precio promedio:${colores.reset} ${colores.green}$${precioPromedio}${colores.reset}\n`);
}

const productosBaratos = (limite = 4.50) => {
  console.log(`\n${colores.bgBlue}${colores.bright} PRODUCTOS BARATOS (<= $${limite}) ${colores.reset}\n`);
  catalogoProductos.productos.filter(p => p.precio <= limite).forEach(p => console.log(`- ${p.nombre}: $${p.precio.toFixed(2)}`));
};

const productosCaros = (limite = 5.00) => {
  console.log(`\n${colores.bgBlue}${colores.bright} PRODUCTOS CAROS (>= $${limite}) ${colores.reset}\n`);
  catalogoProductos.productos.filter(p => p.precio >= limite).forEach(p => console.log(`- ${p.nombre}: $${p.precio.toFixed(2)}`));
};

const bebidas = () => {
  console.log(`\n${colores.bgBlue}${colores.bright} LISTA DE BEBIDAS ${colores.reset}\n`);
  catalogoProductos.productos.filter(p => p.categoria === "Bebida").forEach(p => console.log(`- ${p.nombre}`));
};

const postres = () => {
  console.log(`\n${colores.bgBlue}${colores.bright} LISTA DE POSTRES ${colores.reset}\n`);
  catalogoProductos.productos.filter(p => p.categoria === "Postre").forEach(p => console.log(`- ${p.nombre}`));
};

/* =========================================================
   NUEVO: SIMULACIÓN DE COCINA CON PROMESAS
   ========================================================= */

/* NUEVO: ingredientes disponibles en la cocina */
let ingredientesDisponibles = ["cafe", "leche", "azucar", "chocolate", "fresa", "almendra"];

const ingredientesPorProducto = {
  "Frappé de Chocolate": ["leche", "chocolate", "azucar"],
  "Malteada de Fresa": ["leche", "fresa", "azucar"],
  "Café Espresso": ["cafe"],
  "Cappuccino Artesanal": ["cafe", "leche", "azucar"],
  "Brownie de Chocolate": ["chocolate", "azucar"],
  "Cheesecake de Arándanos": ["leche", "azucar", "fresa"],
  "Croissant de Almendra": ["almendra", "leche", "azucar"],
  "Frappé de Vainilla": ["leche", "azucar"]
};

function ingredientesFaltantes(item) {
  const requeridos = ingredientesPorProducto[item.nombre] || ["leche", "azucar"];
  return requeridos.filter(ingrediente => !ingredientesDisponibles.includes(ingrediente));
}

/* NUEVO: función con promesa para preparar café */
function prepararCafe(nombreCafe) {
  console.log("\n[Cocina] Preparando " + nombreCafe + "...\n");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /* NUEVO: simulación de error en cocina */
      const errorCocina = Math.random() < 0.2;
      if (errorCocina) {
        return reject("Error en cocina: la máquina falló");
      }

      /* NUEVO: simulación de falta de ingrediente */
      const faltaIngrediente = !ingredientesDisponibles.includes("cafe");
      if (faltaIngrediente) {
        return reject("Falta ingrediente: no hay café disponible");
      }

      /* NUEVO: caso exitoso */
      resolve("Café " + nombreCafe + " preparado correctamente");
    }, 2000);
  });
}

/* NUEVO: función para preparar un pedido en el carrito (utilizado en el menú interactivo) */
function prepararPedido(item) {
  console.log(`\n[Cocina] Preparando ${item.nombre}...`);
  return new Promise((resolve, reject) => {
    const faltantes = ingredientesFaltantes(item);
    setTimeout(() => {
      if (faltantes.length > 0) {
        return reject({ mensaje: `No hay suficientes ingredientes para preparar ${item.nombre}. Faltan: ${faltantes.join(', ')}.` });
      }

      if (Math.random() < 0.1) {
        return reject({ mensaje: `La máquina falló al preparar ${item.nombre}.` });
      }

      resolve(`¡${item.nombre} preparado correctamente!`);
    }, 1500);
  });
}

/* NUEVO: función que ejecuta los escenarios de la cocina */
async function simularCocina() {
  console.log("\nSIMULACIÓN DE COCINA CON PROMESAS\n");

  const pedido = [
    catalogoProductos.productos.find(p => p.id === 3),
    catalogoProductos.productos.find(p => p.id === 4),
    catalogoProductos.productos.find(p => p.id === 8)
  ].filter(Boolean);

  try {
    for (const item of pedido) {
      const resultado = await prepararPedido(item);
      console.log(resultado);
    }

    console.log(`\n${colores.green}✓ Pedido completo preparado. Notificando al cliente: todo listo. ${colores.reset}\n`);
  } catch (err) {
    console.log(`\n${colores.red}ERROR EN COCINA:${colores.reset} ${err.mensaje || err}`);
    console.log(`${colores.yellow}Notificando al cliente: hay un problema con el pedido. Por favor, revisa los ingredientes o la máquina.${colores.reset}\n`);
  }
}

/* =========================================================
   MENÚ INTERACTIVO DE GESTIÓN (CRUD)
   ========================================================= */

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
║         CRUD - GESTION DE CAFETERIA                       ║
║                                                           ║
║     Menu Interactivo de Administracion                    ║
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
  console.log(`  ${colores.cyan}8${colores.reset} - Ver productos baratos`);
  console.log(`  ${colores.cyan}9${colores.reset} - Ver productos caros`);
  console.log(`  ${colores.cyan}10${colores.reset} - Ver solo bebidas`);
  console.log(`  ${colores.cyan}11${colores.reset} - Ver solo postres`);
  console.log(`  ${colores.cyan}12${colores.reset} - Simulación de cocina (PROMESAS)`);
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
          rl.question(`${colores.cyan}Categoría (Bebida/Postre): ${colores.reset}`, (categoria) => {
            rl.question(`${colores.cyan}Descripción: ${colores.reset}`, (descripcion) => {
              rl.question(`${colores.cyan}Precio: ${colores.reset}`, (precio) => {
                rl.question(`${colores.cyan}Stock: ${colores.reset}`, (stock) => {
                  console.clear();
                  crearProducto(nombre, categoria, descripcion, parseFloat(precio), parseInt(stock));
                  pausa();
                });
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
            rl.question(`${colores.cyan}Nueva categoría [${producto.categoria}]: ${colores.reset}`, (categoria) => {
              rl.question(`${colores.cyan}Nueva descripción [${producto.descripcion}]: ${colores.reset}`, (descripcion) => {
                rl.question(`${colores.cyan}Nuevo precio [${producto.precio}]: ${colores.reset}`, (precio) => {
                  rl.question(`${colores.cyan}Nuevo stock [${producto.stock}]: ${colores.reset}`, (stock) => {
                    console.clear();
                    const actualizaciones = {};
                    if (nombre.trim() !== '') actualizaciones.nombre = nombre;
                    if (categoria.trim() !== '') actualizaciones.categoria = categoria;
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
      case '8':
        console.clear();
        productosBaratos();
        pausa();
        break;
      case '9':
        console.clear();
        productosCaros();
        pausa();
        break;
      case '10':
        console.clear();
        bebidas();
        pausa();
        break;
      case '11':
        console.clear();
        postres();
        pausa();
        break;
      case '12':
        console.clear();
        if (activePedido) {
          prepararPedidoRed();
        } else {
          simularCocina();
          pausa();
        }
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

let netClient = null;
let cocinando = false;
let activePedido = null;
let suspendedSurvey = null;

function sendJSON(socket, obj) {
  if (socket && !socket.destroyed) {
    socket.write(JSON.stringify(obj) + '\n');
  }
}

function prepararPedidoRed() {
  console.clear();
  console.log(`
${colores.bright}${colores.bgRed}${colores.white} COCINANDO PEDIDO DE CLIENTE EN TIEMPO REAL ${colores.reset}
`);
  console.log(`${colores.bright}${colores.yellow}Productos a preparar:${colores.reset}`);
  activePedido.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.nombre} x${item.cantidad}`);
  });
  console.log(`\n${colores.cyan}Inicia la encuesta de control de calidad (5 preguntas).
Escribe "si", "no", "no hay ingredientes" o "cancelar pedido" en cada paso.${colores.reset}\n`);

  const preguntas = [
    "1. ¿Los ingredientes del producto son selectos y de alta calidad? (si/no/no hay ingredientes/cancelar pedido): ",
    "2. ¿La temperatura y la preparación cumplen las normas de higiene? (si/no/no hay ingredientes/cancelar pedido): ",
    "3. ¿Los utensilios y la estación están perfectamente limpios y desinfectados? (si/no/no hay ingredientes/cancelar pedido): ",
    "4. ¿La presentación y los toppings del pedido están correctos? (si/no/no hay ingredientes/cancelar pedido): ",
    "5. ¿El empaque final es seguro y está listo para entregar? (si/no/no hay ingredientes/cancelar pedido): "
  ];

  realizarEncuestaRed(preguntas, 0);
}

function realizarEncuestaRed(preguntas, index) {
  if (index >= preguntas.length) {
    console.log(`\n${colores.green}Paso 5/5 Aprobado! Control de calidad del pedido completado! Enviando a Caja...${colores.reset}\n`);
    sendJSON(netClient, { type: 'PEDIDO_LISTO' });
    return;
  }

  rl.question(`${colores.yellow}${preguntas[index]}${colores.reset}`, (respuesta) => {
    const res = respuesta.trim().toLowerCase();
    if (res === 'si') {
      const progreso = (index + 1) * 20;
      console.log(`${colores.green}Paso ${index + 1}/5 Aprobado. (Progreso: ${progreso}%)${colores.reset}\n`);

      // Enviar progreso asincrónico a Caja
      sendJSON(netClient, {
        type: 'PREPARACION_PROGRESO',
        progreso: progreso,
        mensaje: `Checklist ${index + 1}/5 aprobado en Cocina.`
      });

      realizarEncuestaRed(preguntas, index + 1);
    } else if (res === 'no hay ingredientes') {
      console.log(`\n${colores.bgRed}${colores.white} FALTA DE INGREDIENTES REPORTADA ${colores.reset}`);
      console.log(`${colores.yellow}Notificando al cliente en tiempo real y esperando su decision...${colores.reset}\n`);

      suspendedSurvey = { preguntas, index };

      sendJSON(netClient, {
        type: 'PEDIDO_INGREDIENTE_FALTANTE',
        motivo: 'No hay ingredientes suficientes en la cocina para preparar tu producto.'
      });
    } else if (res === 'cancelar pedido') {
      const razon = 'Pedido cancelado por el operador de cocina.';
      console.log(`\n${colores.bgRed}${colores.white} PEDIDO CANCELADO POR EL OPERADOR ${colores.reset}`);

      sendJSON(netClient, {
        type: 'PEDIDO_CANCELADO',
        motivo: razon
      });

      activePedido = null;
      pausa();
    } else if (res === 'no') {
      rl.question(`\n${colores.red}Ingresa el motivo de demora o problema en este paso: ${colores.reset}`, (motivo) => {
        const razon = motivo.trim() || `Problema reportado en paso ${index + 1}.`;
        console.log(`\n${colores.yellow}Motivo notificado al cliente. Intenta de nuevo el paso una vez resuelto.${colores.reset}\n`);

        sendJSON(netClient, {
          type: 'PREPARACION_PROGRESO',
          progreso: index * 20,
          mensaje: `Demorado en Cocina: ${razon}`
        });

        realizarEncuestaRed(preguntas, index);
      });
    } else {
      console.log(`${colores.red}Respuesta no valida. Por favor responde "si", "no", "no hay ingredientes" o "cancelar pedido".${colores.reset}\n`);
      realizarEncuestaRed(preguntas, index);
    }
  });
}

if (require.main === module) {
  conectarCajaCentralCocina();
  mostrarMenuCRUD();
}

function conectarCajaCentralCocina() {
  const net = require('net');
  if (netClient && !netClient.destroyed) return;

  netClient = net.createConnection({ port: 5001 }, () => {
    sendJSON(netClient, { type: 'REGISTRO_CLIENTE', role: 'cocina' });
  });

  netClient.on('error', () => {
    if (netClient) {
      netClient.destroy();
      netClient = null;
    }
    setTimeout(conectarCajaCentralCocina, 2000);
  });

  let buffer = '';
  netClient.on('data', (data) => {
    buffer += data.toString();
    let boundary = buffer.indexOf('\n');
    while (boundary !== -1) {
      const input = buffer.substring(0, boundary).trim();
      buffer = buffer.substring(boundary + 1);
      if (input) {
        try {
          const msg = JSON.parse(input);
          handleNetworkMessage(msg);
        } catch (e) { }
      }
      boundary = buffer.indexOf('\n');
    }
  });

  netClient.on('close', () => {
    if (netClient) {
      netClient.destroy();
      netClient = null;
    }
    setTimeout(conectarCajaCentralCocina, 2000);
  });
}

function handleNetworkMessage(msg) {
  if (msg.type === 'PREPARAR_PEDIDO') {
    activePedido = msg.carrito;
    console.clear();
    mostrarMenuCRUD();
    console.log(`\n${colores.bright}${colores.red}[Cocina] NUEVO PEDIDO RECIBIDO EN TIEMPO REAL! Selecciona la opcion '12' del menu para comenzar la preparacion.${colores.reset}\n`);
  } else if (msg.type === 'COMPRA_FINALIZADA') {
    console.log(`\n${colores.green}[Cocina] Caja Central aprobo el cobro! Pedido entregado exitosamente.${colores.reset}`);
    activePedido = null;
    pausa();
  } else if (msg.type === 'CLIENTE_DECISION') {
    if (msg.decision === 'continuar') {
      console.log(`\n${colores.green}[Cocina] El cliente decidio continuar de todos modos. Reanudando preparacion...${colores.reset}\n`);
      if (suspendedSurvey) {
        const { preguntas, index } = suspendedSurvey;
        suspendedSurvey = null;
        realizarEncuestaRed(preguntas, index + 1);
      }
    } else {
      console.log(`\n${colores.red}[Cocina] El cliente decidio cancelar el pedido.${colores.reset}\n`);
      sendJSON(netClient, {
        type: 'PEDIDO_CANCELADO',
        motivo: 'El cliente decidio no continuar por falta de ingredientes.'
      });
      activePedido = null;
      suspendedSurvey = null;
      pausa();
    }
  }
}

/* =========================================================
   EXPORTS
   ========================================================= */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    catalogoProductos,
    prepararPedido,
    leerTodosProductos,
    leerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    mostrarResumen,
    productosConStockBajo,
    contarProductos,
    calcularValorTotalInventario,
    productosBaratos,
    productosCaros,
    bebidas,
    postres,
    simularCocina
  };
}