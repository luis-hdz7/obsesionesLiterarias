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
//*CARGAR LOS LIBROS DEL JSON
//los libros destacados que siempren se cargan
const prefijoRuta = window.location.pathname.includes('paginas/') ? '../' : ''
fetch(`${prefijoRuta}js/libros.json`)
    .then(res=>{
        if(!res.ok){
            throw new Error("No se pudo cargar el archivo JSON");
        }
        return res.json()
    })
    .then(datos=>{
        const contenedorDestacados=document.querySelector('.contenedor-libro-destacados')
        const librosDestacados = datos.filter(libro => libro.categoria === 'destacados')
        contenedorDestacados.innerHTML=librosDestacados.map(item=>`
            <div class="item">
                <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}" data-libro="${item.titulo}">
                <p><strong>${item.titulo}</strong></p>
                <ul>
                    <li><em>${item.autor}</em></li>
                    <li>${item.año}</li>
                </ul>
                <button class="btn-agregarCarrito btn-generico">Agregar al Carrito</button>
            </div>
            `).join('')
    })
    .catch(error=>{
        console.error("Hubo un problema con la operación:", error);
    })
//*Guardar la variable
const iconosCategoria = document.querySelectorAll('.categoria-img');
iconosCategoria.forEach(iconoCategoria => {
    iconoCategoria.addEventListener('click', async (evento) => {
        const seccionEscogida = iconoCategoria.dataset.categoria;
        const contenedor = document.querySelector('.contenedor-libro');
        try {
            const res = await fetch('../js/libros.json');
            if (!res.ok) throw new Error("No se pudo cargar el archivo JSON");
            const datos = await res.json();
            const librosFiltrados = datos.filter(libro => libro.categoria === seccionEscogida);
            contenedor.innerHTML = librosFiltrados.map(item =>`
                <div class="item">
                    <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}" data-libro="${item.titulo}">
                    <p><strong>${item.titulo}</strong></p>
                    <ul>
                        <li><em>${item.autor}</em></li>
                        <li>${item.año}</li>
                    </ul>
                    <button class="btn-agregarCarrito btn-generico">Agregar al Carrito</button>
                </div>
            `).join('');
        } catch (error) {
            console.error("Hubo un problema:", error);
        }
    });
});

//*MIRAR LAS DESCRIPCIONES DE LOS LIBROS
/*const contenedorPopUp= document.createElement('div')
contenedorPopUp.classList.add('overlay-popup')
document.body.appendChild(contenedorPopUp)*/
const contenedorPopUp= document.querySelector('.contenedor-centrado-popUp-apagado')
const bookContainer = document.querySelectorAll('.book-container');
bookContainer.forEach(contenedorLibro=>{
    contenedorLibro.addEventListener('click', async (e)=>{
        if (e.target.tagName==="IMG"){
            let libroEscogido=e.target.dataset.libro
            try {
                contenedorPopUp.classList.remove('contenedor-centrado-popUp-apagado')
                contenedorPopUp.classList.add('contenedor-centrado-popUp')
                const respuesta = await fetch(`${prefijoRuta}js/libros.json`)
                if (!respuesta.ok) throw new Error("No se pudo cargar el archivo JSON");
                const dato = await respuesta.json();
                const librosFiltradosDescripcion = dato.filter(libro => libro.titulo === libroEscogido);
                contenedorPopUp.innerHTML = librosFiltradosDescripcion.map(item =>`
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
                `).join('');
                contenedorPopUp.classList.remove('contenedor-centrado-popUp-apagado');
                contenedorPopUp.classList.add('contenedor-centrado-popUp');
                //*Boton de Cerrado del PopUp
                const botonCerrado = contenedorPopUp.querySelector('.cerrar');
                botonCerrado.addEventListener('click', () => {
                    contenedorPopUp.classList.add('contenedor-centrado-popUp-apagado');
                    contenedorPopUp.classList.remove('contenedor-centrado-popUp');
                })
            } catch (error) {
                console.error("Hubo un problema:", error);
            }
        }
    })
})

