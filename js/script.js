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
        </ul>
        <button class="btn-agregarCarrito btn-generico" data-libro="${item.titulo}">Agregar al Carrito</button>
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
htmlCarrito=(item)=>{
    return(
        `
        <div class="cart-item" data-id="${item.titulo}">
            <div>
                <h4><em>${item.titulo}</em></h4>
            </div>
            <div class="cart-item-descripcion">
                <div class="cart-item-img">
                    <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}">
                </div>
                <div class="cart-item-txt">
                    <div class="cart-item-precio contenedor-texto-centrado"><p class="valor-unitario">13</p></div>
                    <div class="cart-item-cantidad">
                        <button class="menos cambiar-cantidad" data-cambio="mas"><i class="fa-solid fa-plus"></i></button>
                        <p class="cantidad-libro">1</p>
                        <button class="mas cambiar-cantidad" data-cambio="menos"><i class="fa-solid fa-minus"></i></button>
                    </div>
                </div>
            </div>
            <div class="total">
                <p class="total-por-libro"></p>
            </div>
            <div class="eliminar">
                <button class="btn-alargado">Eliminar</button>
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
        contenedorDestacados.innerHTML =librosDestacados.map(item => htmlLibros(prefijoRuta, item)).join('');
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
/*
//*TOOLTIP
const tooltip=document.querySelector('.tool-tip-libros')
const bookContainer = document.querySelectorAll('.book-container')
bookContainer.forEach(contenedorLibro=>{
    contenedorLibro.addEventListener('mouseover',(e)=>{
        if (e.target.tagName==='IMG'){
            bookContainer.append(tooltip)
        }
    })
})*/


//*CARRITO DE COMPRA
//*Cerrar el carrito
const botonCerrado=document.querySelector('.cerrar-cart')
const cartAside=document.querySelector('.cart-inicial')
botonCerrado.addEventListener('click',()=>{
    cartAside.classList.add('apagado')
    cartAside.classList.remove('cart')
})
//*Entrar al Carrito
const carritoPrincipal=document.querySelector('.carrito-principal')
carritoPrincipal.addEventListener('click',()=>{
    cartAside.classList.add('cart')
})


//*
const itemsLibro = document.querySelectorAll('.cart-item');
itemsLibro.forEach(itemLibro => {
    const botonesCambio = itemLibro.querySelectorAll('.cambiar-cantidad');
    const cantidadLibroElemento = itemLibro.querySelector('.cantidad-libro');
    const valorUnitario = itemLibro.querySelector('.valor-unitario');
    const totalPorLibro = itemLibro.querySelector('.total-por-libro');
    const precioUnitario = parseInt(valorUnitario.textContent, 10) || 0;
    const actualizarTotalHijo = () => {
        let cantidadActual = parseInt(cantidadLibroElemento.textContent, 10) || 1;
        totalPorLibro.textContent = precioUnitario * cantidadActual;
    };
    botonesCambio.forEach(botonCambio => {
        botonCambio.addEventListener('click', () => {
            let cantidadNumero = parseInt(cantidadLibroElemento.textContent, 10) || 1;
            if (botonCambio.dataset.cambio === 'mas') {
                cantidadNumero += 1;
            } else if (botonCambio.dataset.cambio === 'menos') {
                cantidadNumero -= 1;
                if (cantidadNumero <= 0) {
                    cantidadNumero = 1;
                }
            }
            cantidadLibroElemento.textContent = cantidadNumero;
            actualizarTotalHijo();
        });
    });
    itemLibro.addEventListener('click', (e) => {
        if (e.target.classList.contains('eliminar')) {
            itemLibro.remove();
            // Opcional: Aquí podrías llamar a una función para actualizar el Gran Total del carrito completo
        }
    });
    actualizarTotalHijo();
});

//* Libros Para el Carrito
const contenedorAsidePrincipal = document.querySelector('.cart-items');
let librosCarritos = new Set();
const quantity = document.querySelector('.quantity');
bookContainer.forEach(contenedorLibro => {
    contenedorLibro.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            librosCarritos.add(e.target.dataset.libro);
            //* Actualizar cantidad
            quantity.textContent = librosCarritos.size;
            //* Obtener los libros completos
            const librosSeleccionados = [...librosCarritos].map(libro =>
                filtrarPorNombre(libro)
            );
            //* Pintar carrito
            contenedorAsidePrincipal.innerHTML = librosSeleccionados.map(item => htmlCarrito(item)).join('');
        }
    });
});
//*Hacer Funcionar los botones
contenedorAsidePrincipal.addEventListener('click', (e) => {
    const itemLibro = e.target.closest('.cart-item');
    if (!itemLibro) return;
    //* Cambiar cantidad
    if (e.target.closest('.cambiar-cantidad')) {
        const botonCambio = e.target.closest('.cambiar-cantidad');
        const cantidadLibroElemento = itemLibro.querySelector('.cantidad-libro');
        const valorUnitario = itemLibro.querySelector('.valor-unitario');
        const totalPorLibro = itemLibro.querySelector('.total-por-libro');
        const precioUnitario = parseInt(valorUnitario.textContent, 10) || 0;
        let cantidadNumero = parseInt(cantidadLibroElemento.textContent, 10) || 1;
        if (botonCambio.dataset.cambio === 'mas') {
            cantidadNumero++;
        } else {
            cantidadNumero--;
            if (cantidadNumero <= 0) {
                cantidadNumero = 1;
            }
        }
        cantidadLibroElemento.textContent = cantidadNumero;
        totalPorLibro.textContent = precioUnitario * cantidadNumero
        actualizarGranTotal();
    }
    //* Eliminar item
    if (e.target.closest('.eliminar')) {
        const idLibro = itemLibro.dataset.id;
        librosCarritos.delete(idLibro);
        itemLibro.remove();
        quantity.textContent = librosCarritos.size;
        actualizarGranTotal();
    }
});

//*Calcular el Total
const actualizarGranTotal = () => {
    const totales = document.querySelectorAll('.total-por-libro');
    let total = 0;
    totales.forEach(totalLibro => {
        total += parseFloat(totalLibro.textContent) || 0;
    });
    document.querySelector('.cart-footer p')
        .textContent = `Total: $${total}`;
}