//*DARK MODE
const btn = document.querySelector(".theme")
const icon = btn.querySelector(".changeTheme")
let darkMode=localStorage.getItem("darkMode")
const habilitarDarkMode=()=>{
    document.body.classList.add("darkMode")
    localStorage.setItem("darkMode","habilitado")
    document.body.classList.toggle('dark-mode')
    icon.classList.toggle("fa-sun")
    icon.classList.toggle("fa-moon")
}
const deshabilitarDarkMode=()=>{
    document.body.classList.remove("darkMode")
    localStorage.setItem("darkMode","deshabilitado")
    document.body.classList.toggle('dark-mode')
    icon.classList.toggle("fa-sun")
    icon.classList.toggle("fa-moon")
}
if (darkMode==="habilitado"){
    habilitarDarkMode()
}
btn.addEventListener("click", () => {
    const modoOscuroActual = localStorage.getItem("darkMode");
    if (modoOscuroActual !== "habilitado") {
        habilitarDarkMode();
    } else {
        deshabilitarDarkMode();
    }
});
//*Cargar los libros del JSON
const prefijoRuta = window.location.pathname.includes('paginas/') ? '../' : ''
let libros=[]
//*Crear las funciones de filtrados
const filtrarPorCategoria = categoria =>
    libros.filter(libro => libro.categoria === categoria);
const filtrarPorTitulo= titulo=>
    libros.filter(libro=>libro.titulo===titulo)
const filtrarPorNombre = nombre =>
    libros.find(libro => libro.titulo === nombre);
const filtrarPorId = id => libros.find(libro => libro.id === Number(id));
const guardarCarrito = () => {
    localStorage.setItem('carritoLibros', JSON.stringify(librosCarritos));
};


//*Crear funciones relacionados al HTML
htmlLibros=(prefijoRuta,item)=>{
    return (`
    <div class="item">
        <div class="contenedor-img-libro">
            <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}" data-libro="${item.titulo}">
            <span class="tooltip-text">Haz click para ver la descripción</span>
        </div>
        <p><strong>${item.titulo}</strong></p>
        <ul>
            <li><em>${item.autor}</em></li>
            <li>${item.año}</li>
            <li>$${item.precio}</li>
        </ul>
        <button class="btn-agregarCarrito btn-generico" data-libro="${item.id}">Agregar al Carrito</button>
    </div>
`)
}
htmlPopUp=(item)=>{
    return (
        `
            <div class="overlay-popup">
                <div class="popup">
                    <button class="cerrar"><i class="fa-solid fa-xmark"></i></button>
                    <div class="contenedor-texto-centrado titulo-sinapsis">
                        <p>${item.titulo}</p>
                    </div>
                    <div class="contenedor-texto-centrado sinapsis">
                        <p>${item.descripcion}</p>
                    </div>
                </div>
            </div>
        `
    )
}
htmlCarrito = (item, cantidad) => {
    return (
        `
        <div class="cart-item" data-id="${item.id}">
            <div class="contenedor-texto-centrado">
                <h4><em>${item.titulo}</em></h4>
            </div>
            <div class="cart-item-descripcion">
                <div class="cart-item-img">
                    <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}">
                </div>
                <div class="cart-item-txt">
                    <div class="cart-item-precio contenedor-texto-centrado">
                        <p>$<span class="valor-unitario">${item.precio}</span></p>
                    </div>
                    <div class="cart-item-cantidad">
                        <button class="mas cambiar-cantidad" data-cambio="mas"><i class="fa-solid fa-plus"></i></button>
                        <!-- 🔄 Ahora muestra la cantidad dinámica -->
                        <p class="cantidad-libro">${cantidad}</p> 
                        <button class="menos cambiar-cantidad" data-cambio="menos"><i class="fa-solid fa-minus"></i></button>
                    </div>
                </div>
            </div>
            <div class="total">
                <!-- 🔄 Mostramos el total acumulado de inmediato -->
                <p>$<span class="total-por-libro">${(item.precio * cantidad).toFixed(2)}</span></p>
            </div>
            <div class="eliminar">
                <button class="btn-alargado eliminar-btn">Eliminar</button>
            </div>
        </div>
        `
    )
}
//* Cargar los libros Destacados
fetch(`${prefijoRuta}js/libros.json`)
    .then(res => {
        if(!res.ok){
            throw new Error("No se pudo cargar el archivo JSON");
        }
        return res.json();
    })
    .then(datos => {
        libros = datos;
        const contenedorDestacados =document.querySelector('.contenedor-libro-destacados');
        const librosDestacados = filtrarPorCategoria('destacados');
        contenedorDestacados.innerHTML =librosDestacados.map(item => htmlLibros(prefijoRuta, item)).join('')
        renderizarCarrito()
    });

//*Cargar Libros dependiendo de la opcion que elija el usuario
const iconosCategoria = document.querySelectorAll('.categoria-img');
iconosCategoria.forEach(iconoCategoria=>{
    iconoCategoria.addEventListener('click',(evento)=>{
        const seccionEscogida = iconoCategoria.dataset.categoria;
        const contenedor = document.querySelector('.contenedor-libro');
        const librosFiltrados=filtrarPorCategoria(seccionEscogida)
        contenedor.innerHTML=librosFiltrados.map(item=> htmlLibros(prefijoRuta,item)).join('');
    })
})

//*Poder ver las descripciones de los libros
const contenedorPopUp= document.querySelector('.contenedor-centrado-popUp-apagado')
const bookContainer = document.querySelectorAll('.book-container');
bookContainer.forEach(contenedorLibro=>{
    contenedorLibro.addEventListener('click',(e)=>{
        if (e.target.tagName==="IMG"){
            let libroEscogido=e.target.dataset.libro
            contenedorPopUp.classList.remove('contenedor-centrado-popUp-apagado')
            contenedorPopUp.classList.add('contenedor-centrado-popUp')
            const librosFiltrados=filtrarPorTitulo(libroEscogido)
            contenedorPopUp.innerHTML=librosFiltrados.map(item=> htmlPopUp(item)).join('')
            const botonCerrado = contenedorPopUp.querySelector('.cerrar');
            botonCerrado.addEventListener('click', () => {
                contenedorPopUp.classList.add('contenedor-centrado-popUp-apagado');
                contenedorPopUp.classList.remove('contenedor-centrado-popUp');
            })
        }
    })
})
//* CARRITO DE COMPRA
//* Cerrar el carrito
const botonCerrado = document.querySelector('.cerrar-cart');
const cartAside = document.querySelector('.cart-inicial');
const carritoPrincipal=document.querySelector('.carrito-principal')
botonCerrado.addEventListener('click', () => {
    cartAside.classList.add('apagado');
    cartAside.classList.remove('cart');
});
//* Entrar al Carrito
carritoPrincipal.addEventListener('click', () => {
    cartAside.classList.remove('apagado');
    cartAside.classList.add('cart');
});
//* Variables del Carrito
const contenedorAsidePrincipal = document.querySelector('.cart-items');
const quantity = document.querySelector('.quantity');
let librosCarritos = JSON.parse(localStorage.getItem('carritoLibros')) || [];

//* 1. Agregar Libros al Carrito desde la tienda
bookContainer.forEach(contenedorLibro => {
    contenedorLibro.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const idLibro = e.target.dataset.libro;
            // Buscar si el libro ya está en el carrito
            const libroExistente = librosCarritos.find(item => item.id === idLibro);
            if (libroExistente) {
                // Si ya existe, aumentamos su cantidad
                libroExistente.cantidad += 1;
            } else {
                // Si es nuevo, lo agregamos con cantidad inicial de 1
                librosCarritos.push({ id: idLibro, cantidad: 1 });
            }
            // Renderizar el carrito actualizado
            renderizarCarrito();
        }
    });
});

//* 2. DELEGACIÓN DE EVENTOS: Controlar botones de más, menos y eliminar dentro del carrito
contenedorAsidePrincipal.addEventListener('click', (e) => {
    const itemLibro = e.target.closest('.cart-item');
    if (!itemLibro) return;
    const idLibro = itemLibro.dataset.id;
    // Buscamos la referencia del objeto en nuestro array de datos
    const libroEnDatos = librosCarritos.find(item => item.id === idLibro);
    //* Botones cambiar cantidad
    if (e.target.closest('.cambiar-cantidad') && libroEnDatos) {
        const botonCambio = e.target.closest('.cambiar-cantidad');
        if (botonCambio.dataset.cambio === 'mas') {
            libroEnDatos.cantidad++;
        } else if (botonCambio.dataset.cambio === 'menos') {
            libroEnDatos.cantidad--;
            if (libroEnDatos.cantidad <= 0) {
                libroEnDatos.cantidad = 1;
            }
        }
        // Re-renderizamos para que todo se sincronice
        renderizarCarrito();
    }

    //* Botón Eliminar
    if (e.target.closest('.eliminar-btn')) {
        // Filtramos el array para remover el objeto eliminado
        librosCarritos = librosCarritos.filter(item => item.id !== idLibro);
        renderizarCarrito();
    }
});

//* 3. Funciones de control y renderizado
//Función central que unifica el renderizado de la interfaz
const renderizarCarrito = () => {
    guardarCarrito();
    const totalProductos = librosCarritos.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );
    quantity.textContent = totalProductos;
    contenedorAsidePrincipal.innerHTML = librosCarritos.map(objetoCarrito => {
        const datosLibro = filtrarPorId(objetoCarrito.id);
        // Validación importante
        if (!datosLibro) return '';
        return htmlCarrito(datosLibro, objetoCarrito.cantidad);
    }).join('');
    actualizarGranTotal();
};
// Calcular el Gran Total de todo el carrito
const actualizarGranTotal = () => {
    const totales = contenedorAsidePrincipal.querySelectorAll('.total-por-libro');
    let total = 0;
    totales.forEach(totalLibro => {
        total += parseFloat(totalLibro.textContent) || 0;
    });
    const granTotalElemento = document.querySelector('.gran-total');
    if (granTotalElemento) {
        granTotalElemento.textContent = total.toFixed(2);
    }
};