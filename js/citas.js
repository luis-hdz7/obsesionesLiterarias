let citas = [
  {
    'autor': 'Julio Cortázar',
    'texto': 'Porque, sin buscarte te ando encontrando por todos lados, principalmente cuando cierro mis ojos.'
  },
  {
    'autor': 'Jean-Paul Sartre',
    'texto': 'Cada palabra tiene consecuencias, cada silencio también.'
  },
  {
    'autor': 'Ana Frank',
    'texto': 'Los muertos reciben más flores que los vivos, porque la culpa es más fuerte que la gratitud.'
  },
  {
    'autor': 'George Orwell',
    'texto': 'Todos los animales son iguales, pero algunos animales son mas iguales que otros.'
  },
  {
    'autor': 'George R. Martin',
    'texto': 'Un lector vive mil vidas antes de morir, el que no lee, solo vive una.'
  },
  {
    'autor': 'Franz Kafka',
    'texto': 'Todo hombre herido se ve forzado a la Metamorfosis.'
  },
  {
    'autor': 'Rubén Darío',
    'texto': 'Dichoso el árbol que es apenas sensitivo y más la piedra dura, porqué esa ya no siente.'
  },
  {
    'autor': 'Victor Hugo',
    'texto': 'Es en las noches de diciembre, cuando el termómetro está a cero, cuando más pensamos en el sol.'
  },
  {
    'autor': 'George Orwell',
    'texto': 'Quien controla el pasado controla el futuro. Quien controla el presente controla el pasado.'
  },
  {
    'autor': 'Fiódor Dostoievski',
    'texto': 'El misterio de la existencia humana no está en quedarse vivo, sino en encontrar algo por lo que vivir.'
  }
];


// Seleccionar los elementos HTML.
let botonElem = document.getElementById('boton-cambiar-cita');
let citaElem = document.getElementById('cita');
let autorElem = document.getElementById('autor');

// Para generar indices aleatorios.
function generarEnteroAleatorio(minimo, maximo) {
  minimo = Math.ceil(minimo);
  maximo = Math.floor(maximo);
  // Incluye el minimo pero no el maximo.
  return Math.floor(Math.random() * (maximo - minimo) + minimo);
}

// Seleccionar una cita aleatoria.
function cambiarCita() {
  let indiceAleatorio = generarEnteroAleatorio(0, citas.length);
  citaElem.textContent = `"${citas[indiceAleatorio].texto}"`;
  autorElem.textContent = citas[indiceAleatorio].autor;
}

// Para seleccionar una cita de forma aleatoria
// cuando se inicia la aplicacion.
let indiceAleatorio = generarEnteroAleatorio(0, citas.length);
cambiarCita();

// Para cambiar la cita al hacer click en el boton.
botonElem.addEventListener('click', cambiarCita);
