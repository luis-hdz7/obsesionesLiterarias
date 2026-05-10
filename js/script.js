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

//*Crear funcion de HTML
htmlLibros=(prefijoRuta,item)=>{
    return (`
    <div class="item">
        <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}" data-libro="${item.titulo}">
        <p><strong>${item.titulo}</strong></p>
        <ul>
            <li><em>${item.autor}</em></li>
            <li>${item.año}</li>
        </ul>
        <button class="btn-agregarCarrito btn-generico">Agregar al Carrito</button>
    </div>`)
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

