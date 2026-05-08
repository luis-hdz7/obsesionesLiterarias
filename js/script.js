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
                <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}">
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
                    <img src="${prefijoRuta}${item.imagen}" alt="Imagen de ${item.titulo}">
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
