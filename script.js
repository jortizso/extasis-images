// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA80NCrZjSt4B6c2YP_fXKSXeMQa2GvqvY",
    authDomain: "publicar-anuncio.firebaseapp.com",
    databaseURL: "https://publicar-anuncio-default-rtdb.firebaseio.com",
    projectId: "publicar-anuncio",
    storageBucket: "publicar-anuncio.appspot.com",
    messagingSenderId: "353743994233",
    appId: "1:353743994233:web:2be4b2a4fb85eb192c03a8",
    measurementId: "G-0SJDYSTHZT"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Función para cerrar modales
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función para obtener la IP del usuario usando la API de ipify
async function obtenerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('Error al obtener la IP');
        }
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error al obtener la IP:', error);
        return null;
    }
}

// Función para obtener el ID del anuncio
function obtenerIdAnuncio() {
    const idContainer = document.querySelector('.ID');
    if (idContainer) {
        // Obtener el texto dentro de .ID y eliminar "ID: " y el span adentro
        const idText = idContainer.innerText.trim();
        const id = idText.replace('ID: ', ''); // Eliminar "ID: "
        return id;
    }
    return null;
}

// Variable global para control de envío de formulario
let enviando = false;  // Estado para evitar envíos múltiples

// Función para validar formulario y habilitar/deshabilitar el botón de enviar
function validarFormulario() {
    const razon = document.getElementById('razon').value.trim();
    let checked = false;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checked = true;
        }
    });

    const botonEnviar = document.getElementById('enviarReporte');
    botonEnviar.disabled = !(razon && checked);

    // Ajustar el estilo del botón según la validación
    if (razon && checked && !enviando) {
        botonEnviar.style.opacity = 1; // Restaurar opacidad normal
        botonEnviar.style.cursor = 'pointer'; // Cambiar cursor a pointer
    } else {
        botonEnviar.style.opacity = 0.5; // Mantener opacidad reducida
        botonEnviar.style.cursor = 'not-allowed'; // Mantener cursor predeterminado
    }
}

// Evento al enviar el formulario
document.getElementById('reportar').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita el envío por defecto del formulario

    if (enviando) {
        console.log('El formulario ya está siendo enviado. Por favor espera.');
        return;
    }

    // Ocultar el botón de enviar
    document.getElementById('enviarReporte').style.display = 'none';

    // Cambiar estado a enviando
    enviando = true;

    // Obtener los valores del formulario
    const razon = document.getElementById('razon').value.trim();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkboxIds = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);

    // Obtener la IP del usuario
    const ip = await obtenerIP();

    // Obtener el ID del anuncio
    const idAnuncio = obtenerIdAnuncio();

    // Guardar el reporte en Firebase
    const timestamp = new Date().getTime();
    try {
        await database.ref('reportes/' + timestamp).set({
            razon: razon,
            checkboxIds: checkboxIds,
            ip: ip,
            idAnuncio: idAnuncio
            // Puedes agregar otros campos según tus necesidades
        });

        // Mostrar la notificación de éxito
        const notificacion = document.getElementById('reporteEnviado');
        notificacion.style.display = 'block';

        // Limpiar formulario y checkboxes después de enviar
        document.getElementById('razon').value = '';
        checkboxes.forEach(checkbox => checkbox.checked = false);

        // Restablecer estado del botón de enviar después de 1 segundo
        setTimeout(() => {
            notificacion.style.display = 'none'; // Ocultar la notificación
            validarFormulario(); // Restablecer el estado del botón de enviar
            document.getElementById('enviarReporte').style.display = 'block'; // Mostrar de nuevo el botón de enviar
        }, 1000);

    } catch (error) {
        console.error('Error al enviar el reporte:', error);
        // Manejar el error aquí según tus necesidades
    } finally {
        enviando = false; // Restablecer enviando a false
    }
});

// Habilitar botón de enviar cuando se escribe en el input y se selecciona un checkbox
document.getElementById('razon').addEventListener('input', validarFormulario);
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => checkbox.addEventListener('change', validarFormulario));

// Funciones para mostrar y ocultar modales
document.querySelector('.contratar').addEventListener('click', (event) => {
    event.preventDefault(); // Evitar que haga scroll hacia arriba
    document.getElementById('modalAdquirir').style.display = 'block';
});

document.querySelector('.reportar').addEventListener('click', (event) => {
    event.preventDefault(); // Evitar que haga scroll hacia arriba
    document.getElementById('modalReportar').style.display = 'block';
});

document.querySelector('.compartir').addEventListener('click', (event) => {
    event.preventDefault(); // Evitar que haga scroll hacia arriba
    document.getElementById('modalCompartir').style.display = 'block';
});

// Cerrar modales al hacer click fuera del contenido
window.onclick = function (event) {
    if (event.target == document.getElementById('modalAdquirir')) {
        document.getElementById('modalAdquirir').style.display = 'none';
    }
    if (event.target == document.getElementById('modalReportar')) {
        document.getElementById('modalReportar').style.display = 'none';
    }
    if (event.target == document.getElementById('modalCompartir')) {
        document.getElementById('modalCompartir').style.display = 'none';
    }
};
