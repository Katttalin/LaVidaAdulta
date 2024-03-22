let intervalo;
//INICIO//
window.onload = function() {
    const btnNuevaPartida = document.getElementById('nuevaPartida');

    btnNuevaPartida.addEventListener('click', function() {
        // Agregar clases de animación a los elementos
        const h1Element = document.querySelector('#sobreFondos h1');
        const buttonElement = document.querySelector('#sobreFondos button');
        
        h1Element.classList.add('animacion-salida-h1');
        buttonElement.classList.add('animacion-salida-btn');
        
        setTimeout(() => {
            console.log('Llamando a mostrarNotificacion y cargarNuevaNotificacion');
            gestorNotificaciones()
        }, 2000); // Ajusta este valor según la duración de tu animación
        // Intervalo inicial de 4 segundos
        let intervalo = setInterval(cargarNuevaNotificacion, 10000)
        function ajustarIntervalo() {
    clearInterval(intervalo);
    // Calcular el próximo intervalo (incremento exponencial)
    let proximoIntervalo = Math.max(800, 10000 / Math.pow(2, contadorNotificaciones));
    intervalo = setInterval(cargarNuevaNotificacion, proximoIntervalo);
}
    });
};

function crearDivEnPortrait() {
    let portraitDiv = document.getElementById('portraitDiv');
    
    if (!portraitDiv) {
        // Si el div no existe, lo creamos
        portraitDiv = document.createElement('div');
        portraitDiv.id = 'portraitDiv';
        document.body.appendChild(portraitDiv);
    }
    
    if (window.matchMedia("(orientation: portrait)").matches) {
        const portrait = `
            <div class="portrait">
                <div class="fondoPortrait">
                    <div class="contenidoPortrait">
                       <img src="assets/imagenes/rotate.svg">
                       <h2>Gira la pantalla</h2>
                    </div>
                </div>
                
            </div>
        `;
        portraitDiv.innerHTML = portrait;
        portraitDiv.style.display = 'block';
    } else {
        portraitDiv.style.display = 'none';
    }
}

// Ejecutar la función al cargar la página y cuando cambie la orientación
window.addEventListener('load', crearDivEnPortrait);
window.addEventListener('resize', crearDivEnPortrait);

function gestorNotificaciones() {
    obtenerDatosAleatorios()
            .then(selectedAlarm => {
                const pregunta = selectedAlarm.alarma;
                const respuestaCorrecta = selectedAlarm.correcta;
                const respuestaIncorrecta = selectedAlarm.incorrecta;
                const categoria = selectedAlarm.categoria;
                mostrarNotificacion(pregunta, respuestaCorrecta, respuestaIncorrecta, categoria);
                
            })
            .catch(error => {
                console.error('Error al cargar la notificación:', error);
            });
}

//PREGUNTAS//
// Función para obtener datos aleatorios del JSON
function obtenerDatosAleatorios() {
    return fetch('data/datos.json')
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            // Devolver un objeto vacío u otro valor predeterminado en caso de error
            return {};
        });
}

// Función para mostrar la notificación con pregunta y respuestas
function mostrarNotificacion(pregunta, respuestaCorrecta, respuestaIncorrecta, categoria) {
    console.log('Mostrando notificación...');
    const randomId = 'notificacion_' + Math.random().toString(36).substr(2, 9); // Generar un identificador único
    const notificacion = `
        <div class="notificacion" id="${randomId}"> <!-- Agregar el ID único -->
            <p class=pregunta>${pregunta}</p>
            <div class=respuestas>
              <button onclick="responder(true, '${categoria}', '${randomId}')">${respuestaCorrecta}</button>
              <button onclick="responder(false, '${categoria}', '${randomId}')">${respuestaIncorrecta}</button>
            </div>
        </div>
    `;
    // Seleccionar la caja por su ID
    const caja = document.getElementById('caja');

    // Insertar el HTML de la notificación dentro de la caja
    caja.insertAdjacentHTML('beforeend', notificacion);

    const nuevaNotificacion = document.getElementById(randomId); // Seleccionar la notificación por su ID único
    const randomX = Math.floor(Math.random() * (window.innerWidth - nuevaNotificacion.offsetWidth));
    const randomY = Math.floor(Math.random() * (window.innerHeight - nuevaNotificacion.offsetHeight));
    nuevaNotificacion.style.left = randomX + 'px';
    nuevaNotificacion.style.top = randomY + 'px';

    setTimeout(() => {
        nuevaNotificacion.classList.add('mostrar');
        ajustarIntervalo(); 
    }, 100);
}


// Cargar y mostrar una nueva notificación
function cargarNuevaNotificacion() {

    // Verificar si se han mostrado ya 30 notificaciones (NUEVO)
    if (contadorNotificaciones >= 100) {
        clearInterval(intervalo);
        console.log("Se han mostrado 100 notificaciones, no se mostrarán más.");
        // Llamar a la función para mostrar la notificación final
        mostrarNotificacionFinal();
        return;
    }
    // Verificar si los puntos de hogar han llegado a 0
    if (puntosHogar === 0) {
        clearInterval(intervalo);
        console.log("Los puntos de hogar han llegado a 0, no se mostrarán más notificaciones.");
        return;
    }
    // Verificar si los puntos de salud han llegado a 0
    if (puntosSalud === 0) {
        clearInterval(intervalo);
        console.log("Los puntos de salud han llegado a 0, no se mostrarán más notificaciones.");
        return;
    }
    // Verificar si los puntos de estudios han llegado a 0
    if (puntosEstudios === 0) {
        clearInterval(intervalo);
        console.log("Los puntos de estudios han llegado a 0, no se mostrarán más notificaciones.");
        return;
    }

    obtenerDatosAleatorios()
        .then(selectedAlarm => {
            const pregunta = selectedAlarm.alarma;
            const respuestaCorrecta = selectedAlarm.correcta;
            const respuestaIncorrecta = selectedAlarm.incorrecta;
            const categoria = selectedAlarm.categoria;
            mostrarNotificacion(pregunta, respuestaCorrecta, respuestaIncorrecta, categoria);
            contadorNotificaciones++; // Incrementar el contador de notificaciones
        })
        .catch(error => {
            console.error('Error al cargar la notificación:', error);
        });
}


// Función para ajustar el intervalo exponencialmente
function ajustarIntervalo() {
    clearInterval(intervalo);
    // Calcular el próximo intervalo (incremento exponencial)
    let proximoIntervalo = Math.max(800, 10000 / Math.pow(2, contadorNotificaciones));
    intervalo = setInterval(cargarNuevaNotificacion, proximoIntervalo);
}

// Función para manejar la respuesta a la pregunta
function responder(esCorrecta, categoria, id) {
    const notificacionDiv = document.getElementById(id); // Seleccionar la notificación por su ID único
    if (!esCorrecta) {
        switch (categoria) {
            case 'hogar':
                puntosHogar -= 10;
                break;
            case 'salud':
                puntosSalud -= 10;
                break;
            case 'estudios':
                puntosEstudios -= 10;
                break;
            default:
                break;
        }
        console.log('Puntos Hogar:', puntosHogar);
        console.log('Puntos Salud:', puntosSalud);
        console.log('Puntos Estudios:', puntosEstudios);
        notificacionDiv.classList.add('no-clicable');
    } else {
        notificacionDiv.style.display = 'none';
    }
    if (contadorNotificaciones < 100) { // Verifica si aún no se han mostrado 100 notificaciones
        verificarNotificacionFinalHogar();
        verificarNotificacionFinalSalud();
        verificarNotificacionFinalEstudios();
    }
}

// Variables para los puntos en cada categoría
let puntosHogar = 100;
let puntosSalud = 100;
let puntosEstudios = 100;

// Contador de notificaciones mostradas
let contadorNotificaciones = 0;

function obtenerImagenGiphy() {
    const apiKey = 'BqRCg5KZbpPFnH2Xa41eWAvAZkcgx166';
    const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=death`;

    return fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Agregar este registro para verificar la estructura de los datos de la API
            const imageUrl = data.data.images.original.url; // URL de la imagen animada de calavera
            return imageUrl;
        })
        .catch(error => {
            console.error('Error al obtener la imagen de Giphy:', error);
            // Devolver una URL de imagen por defecto en caso de error
            return 'https://media.giphy.com/media/l4FGnWuU9FM0y4yDy/giphy.gif';
        });
}

let notificacionFinalMostrada = false; // Bandera para controlar si la notificación final ya se mostró

// Función para mostrar la notificación final con la imagen de Giphy
function mostrarNotificacionFinal() {
    // Verificar si se han mostrado ya 100 notificaciones y si la notificación final no se ha mostrado antes
    if (contadorNotificaciones === 100 && !notificacionFinalMostrada) {
        obtenerImagenGiphy()
            .then(imageUrl => {
                // Crear el nuevo div para la notificación final
                const divFinal = document.createElement('div');
                divFinal.classList.add('Final'); // Añadir una clase para estilos
                // Agregar contenido al div
                divFinal.innerHTML = `
                    <div class="finalMain">
                        <div class="imgFinal">
                            <img src="${imageUrl}" alt="Imagen de Giphy">
                        </div>
                        <div class="textoFinal">
                            <h2>¡Oh no!</h2>
                            <p>Parece que eres demasiado lenta... Mueres por inanición, insalubridad y depresión. Además, parece que has suspendido todas tus asignaturas.</p>
                        </div>
                    </div>
                    <button class="botonOtraVez">
                       <img src="../assets/imagenes/reload.svg" alt="Icono de recarga">
                       Inténtalo de nuevo
                    </button>
                `;
                // Añadir el div al cuerpo del documento
                document.body.appendChild(divFinal);
                // Agregar un retraso de 2 segundos para mostrar el botón
                setTimeout(function() {
                    const botonOtraVez = divFinal.querySelector('.botonOtraVez');
                    botonOtraVez.classList.add('mostrar');
                    botonOtraVez.addEventListener('click', function() {
                        // Redirigir al usuario al índice HTML
                        location.reload();
                    });
                }, 2000);
                notificacionFinalMostrada = true; // Marcar que la notificación final ha sido mostrada
            })
            .catch(error => {
                console.error('Error al mostrar la notificación final:', error);
            });
    }
}

// Función para verificar si se debe mostrar la notificación final del hogar
let notificacionFinalHogarMostrada = false; // Bandera para controlar si la notificación final ya se mostró

// Función para verificar si se debe mostrar la notificación final del hogar
function verificarNotificacionFinalHogar() {
    if (puntosHogar === 0 && !notificacionFinalHogarMostrada) {
        mostrarNotificacionFinalHogar();
        notificacionFinalHogarMostrada = true; // Marcar que la notificación final ha sido mostrada
    }
}

function mostrarNotificacionFinalHogar() {
    obtenerImagenGiphy()
        .then(imageUrl => {
            // Crear el nuevo div para la notificación final solo si los puntos de hogar son 0
            if (puntosHogar === 0) {
                const divFinal = document.createElement('div');
                divFinal.classList.add('Final'); // Añadir una clase para estilos
                // Agregar contenido al div
                divFinal.innerHTML = `
                    <div class="finalMain">
                        <div class="imgFinal">
                            <img src="${imageUrl}" alt="Imagen de Giphy">
                        </div>
                        <div class="textoFinal">
                            <h2>¡Oh no!</h2>
                            <p>Parece que la mierda de tu cocina ha atraido una manada de ratas a tu casa. mueres deborada por miles de pequeños colmillos.</p>
                        </div>
                    </div>
                    <button class="botonOtraVez">
                       <img src="../assets/imagenes/reload.svg" alt="Icono de recarga">
                       Inténtalo de nuevo
                    </button>
                `;
                // Añadir el div al cuerpo del documento
                document.body.appendChild(divFinal);
                // Agregar un retraso de 2 segundos para mostrar el botón
                setTimeout(function() {
                    const botonOtraVez = divFinal.querySelector('.botonOtraVez');
                    botonOtraVez.classList.add('mostrar');
                    botonOtraVez.addEventListener('click', function() {
                        // Redirigir al usuario al índice HTML
                        location.reload();
                    });
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error al mostrar la notificación final:', error);
        });
}

// Función para verificar si se debe mostrar la notificación final del hogar
let notificacionFinalSaludMostrada = false; // Bandera para controlar si la notificación final ya se mostró

// Función para verificar si se debe mostrar la notificación final del hogar
function verificarNotificacionFinalSalud() {
    if (puntosSalud === 0 && !notificacionFinalSaludMostrada) {
        mostrarNotificacionFinalSalud();
        notificacionFinalSaludMostrada = true; // Marcar que la notificación final ha sido mostrada
    }
}

function mostrarNotificacionFinalSalud() {
    obtenerImagenGiphy()
        .then(imageUrl => {
            // Crear el nuevo div para la notificación final solo si los puntos de hogar son 0
            if (puntosSalud === 0 ) {
                const divFinal = document.createElement('div');
                divFinal.classList.add('Final'); // Añadir una clase para estilos
                // Agregar contenido al div
                divFinal.innerHTML = `
                    <div class="finalMain">
                        <div class="imgFinal">
                            <img src="${imageUrl}" alt="Imagen de Giphy">
                        </div>
                        <div class="textoFinal">
                            <h2>¡Oh no!</h2>
                            <p>Parece que tu miedo irracional a llamar al médico ha impedido que identifiquen tu cancer de pulmón. Mueres sola y asustada.</p>
                        </div>
                    </div>
                    <button class="botonOtraVez">
                       <img src="../assets/imagenes/reload.svg" alt="Icono de recarga">
                       Inténtalo de nuevo
                    </button>
                `;
                // Añadir el div al cuerpo del documento
                document.body.appendChild(divFinal);
                // Agregar un retraso de 2 segundos para mostrar el botón
                setTimeout(function() {
                    const botonOtraVez = divFinal.querySelector('.botonOtraVez');
                    botonOtraVez.classList.add('mostrar');
                    botonOtraVez.addEventListener('click', function() {
                        // Redirigir al usuario al índice HTML
                        location.reload();
                    });
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error al mostrar la notificación final:', error);
        });
}
// Función para verificar si se debe mostrar la notificación final del hogar
let notificacionFinalEstudiosMostrada = false; // Bandera para controlar si la notificación final ya se mostró

// Función para verificar si se debe mostrar la notificación final del hogar
function verificarNotificacionFinalEstudios() {
    if (puntosEstudios === 0 && !notificacionFinalEstudiosMostrada) {
        mostrarNotificacionFinalEstudios();
        notificacionFinalEstudiosMostrada = true; // Marcar que la notificación final ha sido mostrada
    }
}
function mostrarNotificacionFinalEstudios() {
    obtenerImagenGiphy()
        .then(imageUrl => {
            // Crear el nuevo div para la notificación final solo si los puntos de hogar son 0
            if (puntosEstudios === 0) {
                const divFinal = document.createElement('div');
                divFinal.classList.add('Final'); // Añadir una clase para estilos
                // Agregar contenido al div
                divFinal.innerHTML = `
                    <div class="finalMain">
                        <div class="imgFinal">
                            <img src="${imageUrl}" alt="Imagen de Giphy">
                        </div>
                        <div class="textoFinal">
                            <h2>¡Oh no!</h2>
                            <p>Parece que tu curriculum es tan malo que has salido en los periodicos como la peor profesional de España. Mueres debajo de un puente en el invierno de 2035.</p>
                        </div>
                    </div>
                    <button class="botonOtraVez">
                       <img src="../assets/imagenes/reload.svg" alt="Icono de recarga">
                       Inténtalo de nuevo
                    </button>
                `;
                // Añadir el div al cuerpo del documento
                document.body.appendChild(divFinal);
                // Agregar un retraso de 2 segundos para mostrar el botón
                setTimeout(function() {
                    const botonOtraVez = divFinal.querySelector('.botonOtraVez');
                    botonOtraVez.classList.add('mostrar');
                    botonOtraVez.addEventListener('click', function() {
                        // Redirigir al usuario al índice HTML
                        location.reload();
                    });
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error al mostrar la notificación final:', error);
        });
}
