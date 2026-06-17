// ==========================================
// 1. CONFIGURACIÓN DE LAS 12 COMUNAS DE LA RM
// ==========================================
const CONFIG_CIUDADES = [
    { id: 1, nombre: "Maipú", lat: -33.5106, lon: -70.7572, imagen: "https://picsum.photos/id/10/400/200" },
    { id: 2, nombre: "Santiago Centro", lat: -33.4489, lon: -70.6693, imagen: "https://picsum.photos/id/11/400/200" },
    { id: 3, nombre: "Puente Alto", lat: -33.6167, lon: -70.5833, imagen: "https://picsum.photos/id/12/400/200" },
    { id: 4, nombre: "La Florida", lat: -33.5227, lon: -70.5983, imagen: "https://picsum.photos/id/13/400/200" },
    { id: 5, nombre: "Providencia", lat: -33.4314, lon: -70.6121, imagen: "https://picsum.photos/id/14/400/200" },
    { id: 6, nombre: "Las Condes", lat: -33.4144, lon: -70.5121, imagen: "https://picsum.photos/id/15/400/200" },
    { id: 7, nombre: "San Bernardo", lat: -33.5921, lon: -70.7042, imagen: "https://picsum.photos/id/16/400/200" },
    { id: 8, nombre: "Pudahuel", lat: -33.4422, lon: -70.7611, imagen: "https://picsum.photos/id/17/400/200" },
    { id: 9, nombre: "Ñuñoa", lat: -33.4569, lon: -70.6033, imagen: "https://picsum.photos/id/18/400/200" },
    { id: 10, nombre: "Quilicura", lat: -33.3614, lon: -70.7303, imagen: "https://picsum.photos/id/19/400/200" },
    { id: 11, nombre: "Recoleta", lat: -33.4061, lon: -70.6486, imagen: "https://picsum.photos/id/20/400/200" },
    { id: 12, nombre: "Peñalolén", lat: -33.4839, lon: -70.5578, imagen: "https://picsum.photos/id/21/400/200" },
];

// Variable global dinámica que se llenará con la API externa
let lugares = [];

// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================
const headerElement = document.querySelector("header");
const tiempoContainer = document.querySelector("#tiempo-container");
const vistaClima = document.querySelector("#vista-clima");
const vistaDetalle = document.querySelector("#tiempo-detalle");
const detalleContenido = document.querySelector("#detalle-container");
const btnBack = document.querySelector("#btn-back");
const resumenDetalle = document.querySelector("#detail-week");
const cantidadDetalle = document.querySelector("#cantidad-detalle");

// ==========================================
// 3. TRADUCTOR DE CÓDIGOS METEOROLÓGICOS (WMO)
// ==========================================
function traducirCodigoWMO(codigo) {
    if (codigo === 0) return { estado: "Despejado", icono: "fa-sun" };
    if ([1, 2, 3].includes(codigo)) return { estado: "Parcialmente Nublado", icono: "fa-cloud-sun" };
    if ([45, 48].includes(codigo)) return { estado: "Neblina", icono: "fa-smog" };
    if ([51, 53, 55, 56, 57].includes(codigo)) return { estado: "Llovizna", icono: "fa-cloud-rain" };
    if ([61, 63, 65, 66, 67].includes(codigo)) return { estado: "Lluvia", icono: "fa-cloud-showers-heavy" };
    if ([71, 73, 75, 77].includes(codigo)) return { estado: "Nieve", icono: "fa-snowflake" };
    if ([80, 81, 82].includes(codigo)) return { estado: "Chubascos", icono: "fa-cloud-sun-rain" };
    if ([95, 96, 99].includes(codigo)) return { estado: "Tormenta Eléctrica", icono: "fa-cloud-bolt" };

    return { estado: "Variable", icono: "fa-cloud" };
}

// ==========================================
// 4. CONSUMO DE API ASÍNCRONA (OPEN-METEO)
// ==========================================
async function consumirOpenMeteoAPI() {
    try {
        const promesas = CONFIG_CIUDADES.map(async (ciudad) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

            const respuesta = await fetch(url);
            if (!respuesta.ok) throw new Error(`Error al conectar con la API para ${ciudad.nombre}`);

            const data = await respuesta.json();
            const climaActual = traducirCodigoWMO(data.current.weather_code);

            const diasSemanaStr = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const pronosticoSemanal = data.daily.time.map((fechaIso, index) => {
                const fechaObjeto = new Date(fechaIso + "T00:00:00");
                const nombreDia = diasSemanaStr[fechaObjeto.getDay()];
                const climaDia = traducirCodigoWMO(data.daily.weather_code[index]);

                return {
                    dia: nombreDia,
                    min: Math.round(data.daily.temperature_2m_min[index]),
                    max: Math.round(data.daily.temperature_2m_max[index]),
                    estado: climaDia.estado,
                    icono: climaDia.icono,
                };
            });

            return {
                id: ciudad.id,
                nombre: ciudad.nombre,
                tempActual: Math.round(data.current.temperature_2m),
                estadoActual: climaActual.estado,
                icono: climaActual.icono,
                humedad: data.current.relative_humidity_2m,
                viento: Math.round(data.current.wind_speed_10m),
                imagen: ciudad.imagen,
                pronosticoSemanal: pronosticoSemanal,
            };
        });

        lugares = await Promise.all(promesas);

        // Renderizamos las tarjetas en la pantalla de inicio
        renderCards();
    } catch (error) {
        console.error("Hubo un fallo crítico en la API de Clima:", error);
        tiempoContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger d-inline-block shadow-sm" role="alert">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i>
                    Error de conexión con el satélite meteorológico. Por favor, recarga la página.
                </div>
            </div>`;
    }
}

// ==========================================
// 5. REQUISITOS TÉCNICOS (PROCESAMIENTO)
// ==========================================
function buscarLugar(criterio) {
    return lugares.find((lugar) => lugar.id === criterio || lugar.nombre.toLowerCase() === String(criterio).toLowerCase());
}

function calcularEstadisticas(pronosticoSemanal) {
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let sumaPromedios = 0;
    const conteoClimas = {};

    for (let i = 0; i < pronosticoSemanal.length; i++) {
        const dia = pronosticoSemanal[i];

        if (dia.min < minTemp) minTemp = dia.min;
        if (dia.max > maxTemp) maxTemp = dia.max;

        sumaPromedios += (dia.min + dia.max) / 2;

        const clima = dia.estado;
        conteoClimas[clima] = (conteoClimas[clima] || 0) + 1;
    }

    const promedioSemanalNum = sumaPromedios / pronosticoSemanal.length;
    const promedioSemanal = promedioSemanalNum.toFixed(1);

    const diasLluvia = (conteoClimas["Lluvia"] || 0) + (conteoClimas["Llovizna"] || 0) + (conteoClimas["Chubascos"] || 0) + (conteoClimas["Tormenta Eléctrica"] || 0);
    const diasSol = (conteoClimas["Soleado"] || 0) + (conteoClimas["Despejado"] || 0);
    const diasNube = (conteoClimas["Nublado"] || 0) + (conteoClimas["Parcialmente Nublado"] || 0);

    let resumenTextual = "Semana con clima variado.";

    if (diasSol >= 4) {
        resumenTextual = "Semana mayormente soleada ☀️";
    } else if (diasLluvia >= 3 && promedioSemanalNum < 15) {
        resumenTextual = "Semana fría con varias lluvias 🌧️❄️";
    } else if (diasLluvia >= 3) {
        resumenTextual = "Semana con bastantes lluvias 🌧️";
    } else if (diasNube >= 4) {
        resumenTextual = "Semana mayormente nublada ☁️";
    }

    return {
        minima: minTemp,
        maxima: maxTemp,
        promedio: promedioSemanal,
        conteo: conteoClimas,
        resumen: resumenTextual,
    };
}

// ==========================================
// 6. FUNCIONES DE RENDERIZACIÓN DE LA VISTA
// ==========================================
function renderCards() {
    let html = "";
    lugares.forEach((l) => {
        html += `
        <div class="col-12 col-sm-6 col-md-4 mb-4">
            <article class="place-card card h-100" data-id="${l.id}" style="cursor:pointer">
                <img src="${l.imagen}" class="card-img-top object-fit-cover" alt="${l.nombre}" />
                <div class="card-body d-flex flex-column">
                    <h5 class="place-card__name">${l.nombre}</h5>
                    <p class="place-card__temp">
                        <small>${l.tempActual} °C / ${l.estadoActual}</small>
                    </p>
                    <div class="mt-auto">
                        <i class="fa-solid ${l.icono} text-warning fs-3"></i>
                    </div>
                </div>
            </article>
        </div>`;
    });
    tiempoContainer.innerHTML = html;
}

function renderDetalle(id) {
    const lugar = buscarLugar(id);
    if (!lugar) return;

    const stats = calcularEstadisticas(lugar.pronosticoSemanal);

    let pronosticoHtml = "";
    lugar.pronosticoSemanal.forEach((dia) => {
        pronosticoHtml += `
            <li class="list-group-item py-3">
                <div class="row align-items-center g-0">
                    <div class="col-3 fw-medium text-dark text-start">
                        ${dia.dia}
                    </div>
                    <div class="col-2 text-center text-primary fs-5">
                        <i class="fa-solid ${dia.icono}"></i>
                    </div>
                    <div class="col-4 text-start text-muted small text-truncate">
                        ${dia.estado}
                    </div>
                    <div class="col-3 text-end font-monospace">
                        <span class="text-info fw-semibold">${dia.min}°</span>
                        <span class="text-muted mx-1">/</span>
                        <span class="text-danger fw-semibold">${dia.max}°</span>
                    </div>
                </div>
            </li>`;
    });

    detalleContenido.innerHTML = `
        <div class="row">
            <div class="col-12 col-md-5 mb-4">
                <img src="${lugar.imagen}" class="img-fluid rounded shadow w-100" alt="${lugar.nombre}" />
            </div>
            <div class="col-12 col-md-7">
                <h2>${lugar.nombre}</h2>
                <div class="d-flex flex-wrap gap-2 mb-4">
                    <span class="badge bg-primary p-2">Humedad: ${lugar.humedad}%</span>
                    <span class="badge bg-info p-2">Viento: ${lugar.viento} km/h</span>
                    <span class="badge bg-warning text-dark p-2">${lugar.estadoActual}</span>
                </div>
                <h5>Pronóstico Semanal</h5>
                <ul class="list-group">
                    ${pronosticoHtml}
                </ul>
            </div>
        </div>`;

    resumenDetalle.innerHTML = `
        <div class="stats-wrapper mb-4">
            <table class="table custom-stats-table text-center mb-0">
                <thead>
                    <tr>
                        <th class="py-3 stats-header" colspan="3">
                            <i class="fa-solid fa-chart-line me-2"></i>ESTADÍSTICAS DE LA SEMANA
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="stats-labels">
                        <th scope="row">T° MÍNIMA</th>
                        <th scope="row">T° MÁXIMA</th>
                        <th scope="row">T° PROMEDIO</th>
                    </tr>
                    <tr class="stats-values fs-4">
                        <td class="min-temp fw-bold">${stats.minima}°C</td>
                        <td class="max-temp fw-bold">${stats.maxima}°C</td>
                        <td class="avg-temp fw-bold">${stats.promedio}°C</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="alert custom-summary-alert text-center shadow-sm">
            <p class="mb-0 fs-5"><i class="fa-solid fa-cloud-sun me-2"></i><strong>Resumen:</strong> ${stats.resumen}</p>
        </div>
    `;

    let countsHtml = `
        <ul class="list-group shadow-sm mt-4 mb-5">
            <li class="list-group-item active text-center fw-bold" aria-current="true">Días por condición climática</li>`;

    for (const [estado, cantidad] of Object.entries(stats.conteo)) {
        countsHtml += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${estado}</span>
                <span class="badge bg-secondary rounded-pill">${cantidad} día(s)</span>
            </li>`;
    }
    countsHtml += `</ul>`;

    cantidadDetalle.innerHTML = countsHtml;
}

// ==========================================
// 7. MANEJO DE VISTAS (Navegación SPA)
// ==========================================
function mostrarHome() {
    vistaClima.classList.remove("d-none");
    headerElement.classList.remove("d-none");
    vistaDetalle.classList.add("d-none");
    resumenDetalle.classList.add("d-none");
    cantidadDetalle.classList.add("d-none");
}

function mostrarDetalle(id) {
    renderDetalle(id);
    vistaClima.classList.add("d-none");
    headerElement.classList.add("d-none");
    vistaDetalle.classList.remove("d-none");
    resumenDetalle.classList.remove("d-none");
    cantidadDetalle.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 8. ASIGNACIÓN DE ESCUCHADORES DE EVENTOS
// ==========================================
tiempoContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".place-card");
    if (card) {
        mostrarDetalle(Number(card.dataset.id));
    }
});

btnBack.addEventListener("click", mostrarHome);

// ==========================================
// 9. INICIALIZACIÓN DISPARADA POR LA API
// ==========================================
document.addEventListener("DOMContentLoaded", consumirOpenMeteoAPI);
