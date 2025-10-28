//DOM
document.addEventListener('DOMContentLoaded', () => { 
    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Deditos de queso',
            descripcion: 'Crujientes y rellenos de delicioso queso costeño, ideales para compartir.',
            precio: 25000,
            imagen: 'assets/img/feature_prod_02.jpg',
            categoria: 'salados'
        },
        {
            id: 2,
            nombre: 'Spring Rolls',
            descripcion: 'Rollitos de verduras frescas y pollo con salsa agridulce.',
            precio: 30000,
            imagen: 'assets/img/shop_04.jpg',
            categoria: 'salados'
        },
        {
            id: 3,
            nombre: 'Cocada',
            descripcion: 'Cocada artesanal de coco tostado con un toque de panela',
            precio: 18000,
            imagen: 'assets/img/bolso2.jpg',
            categoria: 'dulces'
        },
        {
            id: 4,
            nombre: 'Deditos de salchicha',
            descripcion: 'Salchichas envueltas en hojaldre, perfectas para eventos.',
            precio: 20000,
            imagen: 'assets/img/sombrero3.jpg',
            categoria: 'salados'
        },
        {
            id: 5,
            nombre: 'Cocadas artesanales',
            descripcion: 'Dulce de coco rallado con azúcar y leche, horneadas suavemente.',
            precio: 25000,
            imagen: 'assets/img/shop_03.jpg',
            categoria: 'dulces'
        },
        {
            id: 6,
            nombre: 'Pinchos de frutas con chocolate',
            descripcion: 'Fresas, banano y uvas bañadas en chocolate semiamargo.',
            precio: 35000,
            imagen: 'assets/img/category_img_02.jpg',
            categoria: 'dulces'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;
    const filtroSelect = document.getElementById("filtro");

    // Función para renderizar productos
    function renderizarProductos() {
        DOMitems.innerHTML = "";

        const filtro = filtroSelect.value.trim().toLowerCase();

        const productosFiltrados = baseDeDatos.filter(producto => {
            if (filtro === "todas") return true;
            return producto.categoria.toLowerCase().includes(filtro);
        });

        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4', 'mb-3', 'p-2');
            
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body', 'text-center');
            
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid', 'mb-2');
            miNodoImagen.setAttribute('src', info.imagen);
            
            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            const miNodoDesc = document.createElement('p');
            miNodoDesc.classList.add('text-muted', 'small');
            miNodoDesc.textContent = info.descripcion;

            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text', 'fw-bold');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoDesc);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    // Contador de visitas
    let visitas = localStorage.getItem('contadorVisitas');
    if (!visitas) {
        visitas = 0;
    }
    visitas++;
    localStorage.setItem('contadorVisitas', visitas);
    document.getElementById('contador').textContent = visitas;

    // Añadir producto al carrito
    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }

    // Actualizar número del carrito
    function handleCarritoValue(value) {
        const carritoContainer = document.getElementById("carrito-value");
        carritoContainer.textContent = `${value}`;
    }

    // Renderizar carrito
    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDatos) => itemBaseDatos.id === parseInt(item))[0];
            const numeroUnidadesItem = carrito.reduce((total, itemId) => itemId === item ? total += 1 : total, 0);
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem.nombre} - ${miItem.precio}${divisa}`;
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-3');
            miBoton.textContent = 'X';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }

    // Borrar item del carrito
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => carritoId !== id);
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }

    // Calcular total
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDeDatos.find(producto => producto.id === parseInt(item));
            return total + miItem.precio;
        }, 0).toFixed(2);
    }

    // Vaciar carrito
    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
        handleCarritoValue(0);
    }

    // Guardar carrito
    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Cargar carrito
    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            handleCarritoValue(carrito.length);
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});
