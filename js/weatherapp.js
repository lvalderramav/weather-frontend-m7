class WeatherApp {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.lugares = [];

        this.headerElement = document.querySelector("header");
        this.tiempoContainer = document.querySelector("#tiempo-container");
        this.vistaClima = document.querySelector("#vista-clima");
        this.vistaDetalle = document.querySelector("#tiempo-detalle");
        this.detalleContenido = document.querySelector("#detalle-container");
        this.resumenDetalle = document.querySelector("#detail-week");
        this.cantidadDetalle = document.querySelector("#cantidad-detalle");
    }

    // CARGA LAS CIUDADES DEL API Y RENDERIZA AL HOME
    async cargarLugares() {
        this.mostrarMensajeDeCarga();
        try {
            // Consumo de API asíncrono
            this.lugares = await this.apiClient.fetchWeatherData();
            this.renderCards();
        } catch (error) {
            this.mostrarMensajeDeError("No se pudieron cargar los datos del clima. Por favor inténtalo más tarde.");
        }
    }

    // RENDER DE CARDS
    renderCards() {
        if (this.lugares.length === 0) return;

        let html = "";
        this.lugares.forEach((lugar) => {
            html += `
            <div class="col-12 col-sm-6 col-md-4 mb-4">
                <article class="place-card card h-100" data-id="${lugar.id}" style="cursor:pointer">
                    <img src="${lugar.imagen}" class="card-img-top object-fit-cover" alt="${lugar.nombre}" />
                    <div class="card-body d-flex flex-column">
                        <h5 class="place-card__name">${lugar.nombre}</h5>
                        <p class="place-card__temp">
                            <small>${lugar.tempActual} °C / ${lugar.estadoActual}</small>
                        </p>
                        <div class="mt-auto">
                            <i class="fa-solid ${lugar.icono} text-warning fs-3"></i>
                        </div>
                    </div>
                </article>
            </div>`;
        });
        this.tiempoContainer.innerHTML = html;
    }
    // PROCESA Y RENDERIZA LA INFORMACIÓN DE LA COMUNA
    cargarDetalleLugar(id) {
        const lugar = this.lugares.find((l) => l.id === id);
        if (!lugar) {
            this.mostrarMensajeDeError("Lugar no encontrado.");
            return;
        }

        // ESTADISTICA
        const stats = this.calcularEstadisticas(lugar.pronosticoSemanal);

        let pronosticoHtml = "";
        lugar.pronosticoSemanal.forEach((dia) => {
            pronosticoHtml += `
                <li class="list-group-item mt-2 py-2">
                    <div class="row align-items-center g-0">
                        
                        <div class="col-3 fw-medium text-dark text-start">
                            ${dia.dia}
                        </div>
                        
                        <div class="col-2 text-center fs-5">
                            <i class="fa-solid ${dia.icono}"></i>
                        </div>
                        
                        <div class="col-4 text-start text-muted small text-truncate">
                            ${dia.estado}
                        </div>
                        <div class="col-3 text-end font-monospace">
                            <span class="text-info fw-semibold">${dia.min}°C</span> 
                            <span class="text-muted mx-1">/</span>
                            <span class="text-danger fw-semibold">${dia.max}°C</span>
                        </div>
                    </div>
                </li>`;
        });

        // BLOQUE DETALLE
        this.detalleContenido.innerHTML = `
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

        // ALERTAS PARA LA SEMANA
        let alertaHtml = "";
        if (Number(stats.promedio) > 22) {
            alertaHtml = `<div class="alert alert-danger text-center fw-bold"><i class="fa-solid fa-fire me-2"></i>¡Alerta de calor detectada para la semana!</div>`;
        } else if (stats.diasLluvia >= 2) {
            alertaHtml = `<div class="alert alert-warning text-center fw-bold"><i class="fa-solid fa-cloud-showers-heavy me-2"></i>Alerta: Semana lluviosa.</div>`;
        } else {
            alertaHtml = `<div class="alert alert-success text-center"><i class="fa-solid fa-circle-check me-2"></i>Condiciones estables.</div>`;
        }

        // RESUMEN ESTADISTICAS Y ALERTAS CLIMATICAS
        this.resumenDetalle.innerHTML = `
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
            
            <h5 class="mt-4">Alertas de clima</h5>
            ${alertaHtml}

            <div class="alert custom-summary-alert text-center shadow-sm mt-3">
                <p class="mb-0 fs-5"><i class="fa-solid fa-cloud-sun me-2"></i><strong>Resumen:</strong> ${stats.resumen}</p>
            </div>
        `;

        let countsHtml = `
            <ul class="list-group shadow-sm mt-4 mb-5">
                <li class="list-group-item active text-center fw-bold">DÍAS POR CONDICIÓN CLIMÁTICA</li>`;
        for (const [estado, cantidad] of Object.entries(stats.conteo)) {
            countsHtml += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${estado}</span>
                    <span class="badge bg-secondary rounded-pill">${cantidad} día(s)</span>
                </li>`;
        }
        countsHtml += `</ul>`;
        this.cantidadDetalle.innerHTML = countsHtml;

        this.mostrarVistasDetalle();
    }

    // ANALISIS DEL PRONOSTICO
    calcularEstadisticas(pronosticoSemanal) {
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

        const diasLluvia = (conteoClimas["Lluvia"] || 0) + (conteoClimas["Lluvia débil"] || 0) + (conteoClimas["Chubascos"] || 0);
        const diasSol = (conteoClimas["Soleado"] || 0) + (conteoClimas["Despejado"] || 0);
        const diasNube = (conteoClimas["Nublado"] || 0) + (conteoClimas["Parcial"] || 0) + (conteoClimas["Nubes y claros"] || 0);

        let resumenTextual = "Semana con clima variado.";
        if (diasSol >= 4) resumenTextual = "Semana mayormente soleada ☀️";
        else if (diasLluvia >= 3) resumenTextual = "Semana con bastantes lluvias 🌧️";
        else if (diasNube >= 4) resumenTextual = "Semana mayormente nublada ☁️";

        return {
            minima: minTemp,
            maxima: maxTemp,
            promedio: promedioSemanalNum.toFixed(1),
            conteo: conteoClimas,
            resumen: resumenTextual,
            diasLluvia,
        };
    }

    // ESTADOS DE LA INTERFAZ
    mostrarMensajeDeCarga() {
        this.tiempoContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Cargando datos meteorológicos en tiempo real...</p>
            </div>`;
    }

    mostrarMensajeDeError(mensaje) {
        this.tiempoContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger d-inline-block" role="alert">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i> ${mensaje}
                </div>
            </div>`;
    }

    mostrarHome() {
        this.vistaClima.classList.remove("d-none");
        this.headerElement.classList.remove("d-none");
        this.vistaDetalle.classList.add("d-none");
        this.resumenDetalle.classList.add("d-none");
        this.cantidadDetalle.classList.add("d-none");
    }

    mostrarVistasDetalle() {
        this.vistaClima.classList.add("d-none");
        this.headerElement.classList.add("d-none");
        this.vistaDetalle.classList.remove("d-none");
        this.resumenDetalle.classList.remove("d-none");
        this.cantidadDetalle.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}
