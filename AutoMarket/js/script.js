/* =====================================================
   AUTOMARKET
   JAVASCRIPT PRINCIPAL
   Ahora consulta la API real (Express + MongoDB)
   en vez de usar localStorage.
===================================================== */


/* =====================================================
   CONFIGURACIÓN DE LA API
===================================================== */

// Mientras desarrollas en tu máquina, deja esta URL.
// Cuando despliegues el backend en Render, cámbiala por
// la URL pública, ej: "https://automarket-api.onrender.com/api"
const API_BASE = "http://localhost:4000/api";

// Guardamos en memoria la última lista de vehículos que
// trajo el servidor, para poder filtrarla sin volver a pedirla.
let vehiculosCache = [];


/* =====================================================
   OBTENER VEHÍCULOS DESDE LA API
===================================================== */

async function obtenerVehiculos() {
    try {
        const respuesta = await fetch(`${API_BASE}/vehiculos`);
        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }
        const vehiculos = await respuesta.json();
        vehiculosCache = vehiculos;
        return vehiculos;
    } catch (error) {
        console.error("No se pudo obtener el catálogo:", error);
        return [];
    }
}


/* =====================================================
   OBTENER UN VEHÍCULO POR ID DESDE LA API
===================================================== */

async function obtenerVehiculoPorId(id) {
    try {
        const respuesta = await fetch(`${API_BASE}/vehiculos/${id}`);
        if (!respuesta.ok) {
            return null;
        }
        return await respuesta.json();
    } catch (error) {
        console.error("No se pudo obtener el vehículo:", error);
        return null;
    }
}


/* =====================================================
   PUBLICAR UN VEHÍCULO NUEVO EN LA API
===================================================== */

async function crearVehiculo(datosVehiculo) {
    const respuesta = await fetch(`${API_BASE}/vehiculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosVehiculo)
    });

    if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => ({}));
        throw new Error(detalle.error || "No se pudo publicar el vehículo.");
    }

    return respuesta.json();
}


/* =====================================================
   ENVIAR UNA CONSULTA DE CONTACTO A LA API
===================================================== */

async function crearConsulta(datosConsulta) {
    const respuesta = await fetch(`${API_BASE}/consultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosConsulta)
    });

    if (!respuesta.ok) {
        const detalle = await respuesta.json().catch(() => ({}));
        throw new Error(detalle.error || "No se pudo enviar la consulta.");
    }

    return respuesta.json();
}


/* =====================================================
   MOSTRAR CATÁLOGO
===================================================== */

function mostrarCatalogo(vehiculos) {
    const catalogo = document.getElementById("catalogo");
    const sinResultados = document.getElementById("sinResultados");

    if (!catalogo) {
        return;
    }

    catalogo.innerHTML = "";

    if (!vehiculos || vehiculos.length === 0) {
        if (sinResultados) {
            sinResultados.style.display = "block";
        }
        return;
    }

    if (sinResultados) {
        sinResultados.style.display = "none";
    }

    vehiculos.forEach(vehiculo => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "vehicle-card";

        const imagenHTML = vehiculo.imagen
            ? `<img src="${vehiculo.imagen}" alt="${vehiculo.marca} ${vehiculo.modelo}" onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'), { className: 'vehicle-image-fallback', textContent: '🚗' }));">`
            : `<div class="vehicle-image-fallback">${vehiculo.icono || "🚗"}</div>`;

        tarjeta.innerHTML = `
            <div class="vehicle-image">
                ${imagenHTML}
            </div>
            <div class="vehicle-info">
                <span class="vehicle-year">${vehiculo.anio}</span>
                <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
                <p>${vehiculo.caracteristicas}</p>
                <strong>$${Number(vehiculo.precio).toLocaleString()}</strong>
                <a href="detalle.html?id=${vehiculo._id}" class="btn btn-small">Ver detalles</a>
            </div>
        `;

        catalogo.appendChild(tarjeta);
    });
}


/* =====================================================
   CARGAR Y MOSTRAR EL CATÁLOGO (primera carga de la página)
===================================================== */

async function cargarCatalogo() {
    const catalogo = document.getElementById("catalogo");
    if (!catalogo) {
        return;
    }
    const vehiculos = await obtenerVehiculos();
    mostrarCatalogo(vehiculos);
}


/* =====================================================
   FILTRAR VEHÍCULOS (sobre los datos ya cargados)
===================================================== */

function filtrarVehiculos() {
    const texto = document.getElementById("searchVehicle")?.value.toLowerCase().trim();
    const marca = document.getElementById("filterBrand")?.value;
    const anio = document.getElementById("filterYear")?.value;

    let vehiculos = vehiculosCache;

    vehiculos = vehiculos.filter(vehiculo => {
        const coincideTexto =
            !texto ||
            vehiculo.marca.toLowerCase().includes(texto) ||
            vehiculo.modelo.toLowerCase().includes(texto);

        const coincideMarca = !marca || vehiculo.marca === marca;
        const coincideAnio = !anio || vehiculo.anio >= Number(anio);

        return coincideTexto && coincideMarca && coincideAnio;
    });

    mostrarCatalogo(vehiculos);
}


/* =====================================================
   DETALLE DEL VEHÍCULO
===================================================== */

async function mostrarDetalle() {
    const contenedor = document.getElementById("detalleVehiculo");
    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    const vehiculo = id ? await obtenerVehiculoPorId(id) : null;

    if (!vehiculo) {
        contenedor.innerHTML = `
            <div class="no-results">
                <h3>Vehículo no encontrado</h3>
                <p>El vehículo solicitado no existe.</p>
                <br>
                <a href="catalogo.html" class="btn btn-primary">Volver al catálogo</a>
            </div>
        `;
        return;
    }

    const imagenDetalleHTML = vehiculo.imagen
        ? `<img src="${vehiculo.imagen}" alt="${vehiculo.marca} ${vehiculo.modelo}" onerror="this.onerror=null; this.replaceWith(Object.assign(document.createElement('div'), { className: 'detail-image-fallback', textContent: '🚗' }));">`
        : `<div class="detail-image-fallback">${vehiculo.icono || "🚗"}</div>`;

    contenedor.innerHTML = `
        <div class="detail-card">
            <div class="detail-image">
                ${imagenDetalleHTML}
            </div>
            <div class="detail-info">
                <span class="vehicle-year">${vehiculo.anio}</span>
                <h2>${vehiculo.marca} ${vehiculo.modelo}</h2>
                <p>${vehiculo.descripcion}</p>
                <div class="detail-price">$${Number(vehiculo.precio).toLocaleString()}</div>
                <ul class="detail-list">
                    <li><strong>Marca:</strong> ${vehiculo.marca}</li>
                    <li><strong>Modelo:</strong> ${vehiculo.modelo}</li>
                    <li><strong>Año:</strong> ${vehiculo.anio}</li>
                    <li><strong>Características:</strong> ${vehiculo.caracteristicas}</li>
                </ul>
                <a href="contacto.html?vehiculo=${vehiculo._id}" class="btn btn-primary">Consultar vehículo</a>
            </div>
        </div>
    `;
}


/* =====================================================
   PUBLICAR VEHÍCULO
===================================================== */

function configurarFormularioPublicar() {
    const formulario = document.getElementById("formPublicar");
    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();

        const marca = document.getElementById("marca").value.trim();
        const modelo = document.getElementById("modelo").value.trim();
        const anio = Number(document.getElementById("anio").value);
        const precio = Number(document.getElementById("precio").value);
        const caracteristicas = document.getElementById("caracteristicas").value.trim();
        const imagen = document.getElementById("imagen").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (!marca || !modelo || !anio || !precio || !caracteristicas || !descripcion) {
            mostrarMensaje("mensajePublicacion", "Completa todos los campos obligatorios.", "error");
            return;
        }

        const nuevoVehiculo = {
            marca,
            modelo,
            anio,
            precio,
            caracteristicas,
            descripcion,
            imagen: imagen || undefined,
            icono: "🚗"
        };

        try {
            await crearVehiculo(nuevoVehiculo);
            mostrarMensaje("mensajePublicacion", "¡Vehículo publicado correctamente!", "success");
            formulario.reset();
        } catch (error) {
            mostrarMensaje(
                "mensajePublicacion",
                error.message || "No se pudo publicar el vehículo. Intenta de nuevo.",
                "error"
            );
        }
    });
}


/* =====================================================
   FORMULARIO DE CONTACTO
===================================================== */

function configurarFormularioContacto() {
    const formulario = document.getElementById("formContacto");
    if (!formulario) {
        return;
    }

    // Si venimos desde "Consultar vehículo" en detalle.html,
    // el id del vehículo llega como parámetro en la URL.
    const parametros = new URLSearchParams(window.location.search);
    const idVehiculo = parametros.get("vehiculo");

    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!nombre || !correo || !mensaje) {
            mostrarMensaje("mensajeContacto", "Completa los campos obligatorios.", "error");
            return;
        }

        const nuevaConsulta = {
            nombre,
            correo,
            telefono,
            mensaje,
            id_vehiculo: idVehiculo || undefined
        };

        try {
            await crearConsulta(nuevaConsulta);
            mostrarMensaje(
                "mensajeContacto",
                "¡Consulta enviada correctamente! Nos comunicaremos contigo.",
                "success"
            );
            formulario.reset();
        } catch (error) {
            mostrarMensaje(
                "mensajeContacto",
                error.message || "No se pudo enviar la consulta. Intenta de nuevo.",
                "error"
            );
        }
    });
}


/* =====================================================
   MOSTRAR MENSAJES
===================================================== */

function mostrarMensaje(elementoId, texto, tipo) {
    const elemento = document.getElementById(elementoId);
    if (!elemento) {
        return;
    }

    elemento.textContent = texto;
    elemento.className = `form-message ${tipo}`;

    setTimeout(() => {
        elemento.className = "form-message";
    }, 5000);
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    cargarCatalogo();
    mostrarDetalle();
    configurarFormularioPublicar();
    configurarFormularioContacto();
});