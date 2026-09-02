/* =====================================================
   AUTOMARKET
   JAVASCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   DATOS INICIALES DE VEHÍCULOS
===================================================== */

const vehiculosIniciales = [

    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2024,
        precio: 22500,
        caracteristicas: "Automático, gasolina, 5 puertas",
        descripcion:
            "Toyota Corolla en excelente estado, ideal para uso urbano y familiar.",
        icono: "🚘"
    },

    {
        id: 2,
        marca: "Honda",
        modelo: "CR-V",
        anio: 2023,
        precio: 29900,
        caracteristicas: "Automático, gasolina, SUV",
        descripcion:
            "Honda CR-V con amplio espacio interior y excelente comodidad.",
        icono: "🚙"
    },

    {
        id: 3,
        marca: "BMW",
        modelo: "Serie 3",
        anio: 2024,
        precio: 45000,
        caracteristicas: "Automático, gasolina, premium",
        descripcion:
            "BMW Serie 3 con diseño moderno, tecnología y alto rendimiento.",
        icono: "🏎️"
    },

    {
        id: 4,
        marca: "Ford",
        modelo: "Ranger",
        anio: 2023,
        precio: 35000,
        caracteristicas: "Manual, diésel, pickup",
        descripcion:
            "Ford Ranger preparada para trabajo y aventura.",
        icono: "🛻"
    },

    {
        id: 5,
        marca: "Toyota",
        modelo: "RAV4",
        anio: 2025,
        precio: 38000,
        caracteristicas: "Automático, híbrido, SUV",
        descripcion:
            "Toyota RAV4 moderna con tecnología híbrida y gran espacio.",
        icono: "🚙"
    },

    {
        id: 6,
        marca: "Honda",
        modelo: "Civic",
        anio: 2024,
        precio: 26000,
        caracteristicas: "Automático, gasolina, sedán",
        descripcion:
            "Honda Civic moderno, cómodo y eficiente para uso diario.",
        icono: "🚗"
    }

];


/* =====================================================
   OBTENER VEHÍCULOS
===================================================== */

function obtenerVehiculos() {

    const guardados =
        localStorage.getItem("automarket_vehiculos");

    if (guardados) {

        return JSON.parse(guardados);

    }

    localStorage.setItem(
        "automarket_vehiculos",
        JSON.stringify(vehiculosIniciales)
    );

    return vehiculosIniciales;

}


/* =====================================================
   GUARDAR VEHÍCULOS
===================================================== */

function guardarVehiculos(vehiculos) {

    localStorage.setItem(
        "automarket_vehiculos",
        JSON.stringify(vehiculos)
    );

}


/* =====================================================
   MOSTRAR CATÁLOGO
===================================================== */

function mostrarCatalogo(vehiculos = obtenerVehiculos()) {

    const catalogo =
        document.getElementById("catalogo");

    const sinResultados =
        document.getElementById("sinResultados");


    if (!catalogo) {

        return;

    }


    catalogo.innerHTML = "";


    if (vehiculos.length === 0) {

        sinResultados.style.display =
            "block";

        return;

    }


    sinResultados.style.display =
        "none";


    vehiculos.forEach(vehiculo => {

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "vehicle-card";


        tarjeta.innerHTML = `

            <div class="vehicle-image">

                ${vehiculo.icono || "🚗"}

            </div>


            <div class="vehicle-info">

                <span class="vehicle-year">

                    ${vehiculo.anio}

                </span>


                <h3>

                    ${vehiculo.marca}
                    ${vehiculo.modelo}

                </h3>


                <p>

                    ${vehiculo.caracteristicas}

                </p>


                <strong>

                    $${Number(vehiculo.precio)
                        .toLocaleString()}

                </strong>


                <a
                    href="detalle.html?id=${vehiculo.id}"
                    class="btn btn-small">

                    Ver detalles

                </a>

            </div>

        `;


        catalogo.appendChild(tarjeta);

    });

}


/* =====================================================
   FILTRAR VEHÍCULOS
===================================================== */

function filtrarVehiculos() {

    const texto =
        document
            .getElementById("searchVehicle")
            ?.value
            .toLowerCase()
            .trim();


    const marca =
        document
            .getElementById("filterBrand")
            ?.value;


    const anio =
        document
            .getElementById("filterYear")
            ?.value;


    let vehiculos =
        obtenerVehiculos();


    vehiculos =
        vehiculos.filter(vehiculo => {

            const coincideTexto =
                !texto ||
                vehiculo.marca
                    .toLowerCase()
                    .includes(texto) ||
                vehiculo.modelo
                    .toLowerCase()
                    .includes(texto);


            const coincideMarca =
                !marca ||
                vehiculo.marca === marca;


            const coincideAnio =
                !anio ||
                vehiculo.anio >= Number(anio);


            return (
                coincideTexto &&
                coincideMarca &&
                coincideAnio
            );

        });


    mostrarCatalogo(vehiculos);

}


/* =====================================================
   DETALLE DEL VEHÍCULO
===================================================== */

function mostrarDetalle() {

    const contenedor =
        document.getElementById(
            "detalleVehiculo"
        );


    if (!contenedor) {

        return;

    }


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        Number(parametros.get("id"));


    const vehiculo =
        obtenerVehiculos()
            .find(item => item.id === id);


    if (!vehiculo) {

        contenedor.innerHTML = `

            <div class="no-results">

                <h3>
                    Vehículo no encontrado
                </h3>

                <p>
                    El vehículo solicitado
                    no existe.
                </p>

                <br>

                <a
                    href="catalogo.html"
                    class="btn btn-primary">

                    Volver al catálogo

                </a>

            </div>

        `;

        return;

    }


    contenedor.innerHTML = `

        <div class="detail-card">

            <div class="detail-image">

                ${vehiculo.icono || "🚗"}

            </div>


            <div class="detail-info">

                <span class="vehicle-year">

                    ${vehiculo.anio}

                </span>


                <h2>

                    ${vehiculo.marca}
                    ${vehiculo.modelo}

                </h2>


                <p>

                    ${vehiculo.descripcion}

                </p>


                <div class="detail-price">

                    $${Number(vehiculo.precio)
                        .toLocaleString()}

                </div>


                <ul class="detail-list">

                    <li>
                        <strong>
                            Marca:
                        </strong>

                        ${vehiculo.marca}
                    </li>


                    <li>
                        <strong>
                            Modelo:
                        </strong>

                        ${vehiculo.modelo}
                    </li>


                    <li>
                        <strong>
                            Año:
                        </strong>

                        ${vehiculo.anio}
                    </li>


                    <li>
                        <strong>
                            Características:
                        </strong>

                        ${vehiculo.caracteristicas}
                    </li>

                </ul>


                <a
                    href="contacto.html"
                    class="btn btn-primary">

                    Consultar vehículo

                </a>

            </div>

        </div>

    `;

}


/* =====================================================
   PUBLICAR VEHÍCULO
===================================================== */

function configurarFormularioPublicar() {

    const formulario =
        document.getElementById(
            "formPublicar"
        );


    if (!formulario) {

        return;

    }


    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const marca =
                document
                    .getElementById("marca")
                    .value
                    .trim();


            const modelo =
                document
                    .getElementById("modelo")
                    .value
                    .trim();


            const anio =
                Number(
                    document
                        .getElementById("anio")
                        .value
                );


            const precio =
                Number(
                    document
                        .getElementById("precio")
                        .value
                );


            const caracteristicas =
                document
                    .getElementById(
                        "caracteristicas"
                    )
                    .value
                    .trim();


            const descripcion =
                document
                    .getElementById(
                        "descripcion"
                    )
                    .value
                    .trim();


            if (
                !marca ||
                !modelo ||
                !anio ||
                !precio ||
                !caracteristicas ||
                !descripcion
            ) {

                mostrarMensaje(
                    "mensajePublicacion",
                    "Completa todos los campos obligatorios.",
                    "error"
                );

                return;

            }


            const vehiculos =
                obtenerVehiculos();


            const nuevoVehiculo = {

                id:
                    Date.now(),

                marca,

                modelo,

                anio,

                precio,

                caracteristicas,

                descripcion,

                icono: "🚗"

            };


            vehiculos.push(
                nuevoVehiculo
            );


            guardarVehiculos(
                vehiculos
            );


            mostrarMensaje(
                "mensajePublicacion",
                "¡Vehículo publicado correctamente!",
                "success"
            );


            formulario.reset();

        }
    );

}


/* =====================================================
   FORMULARIO DE CONTACTO
===================================================== */

function configurarFormularioContacto() {

    const formulario =
        document.getElementById(
            "formContacto"
        );


    if (!formulario) {

        return;

    }


    formulario.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nombre =
                document
                    .getElementById("nombre")
                    .value
                    .trim();


            const correo =
                document
                    .getElementById("correo")
                    .value
                    .trim();


            const telefono =
                document
                    .getElementById("telefono")
                    .value
                    .trim();


            const mensaje =
                document
                    .getElementById("mensaje")
                    .value
                    .trim();


            if (
                !nombre ||
                !correo ||
                !mensaje
            ) {

                mostrarMensaje(
                    "mensajeContacto",
                    "Completa los campos obligatorios.",
                    "error"
                );

                return;

            }


            const consultas =
                JSON.parse(
                    localStorage.getItem(
                        "automarket_consultas"
                    )
                ) || [];


            const nuevaConsulta = {

                id:
                    Date.now(),

                nombre,

                correo,

                telefono,

                mensaje,

                fecha:
                    new Date()
                        .toLocaleString()

            };


            consultas.push(
                nuevaConsulta
            );


            localStorage.setItem(
                "automarket_consultas",
                JSON.stringify(
                    consultas
                )
            );


            mostrarMensaje(
                "mensajeContacto",
                "¡Consulta enviada correctamente! Nos comunicaremos contigo.",
                "success"
            );


            formulario.reset();

        }
    );

}


/* =====================================================
   MOSTRAR MENSAJES
===================================================== */

function mostrarMensaje(
    elementoId,
    texto,
    tipo
) {

    const elemento =
        document.getElementById(
            elementoId
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        texto;


    elemento.className =
        `form-message ${tipo}`;


    setTimeout(() => {

        elemento.className =
            "form-message";

    }, 5000);

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarCatalogo();

        mostrarDetalle();

        configurarFormularioPublicar();

        configurarFormularioContacto();

    }
);