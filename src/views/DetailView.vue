<template>
    <section id="tiempo-detalle" class="py-2">
        <router-link to="/" class="btn btn-success mb-4 px-4 shadow-sm"> <i class="fa-solid fa-arrow-left me-2"></i>Regresar al Inicio </router-link>

        <div v-if="lugar" id="detalle-container">
            <div class="row">
                <div class="col-12 col-md-5 mb-4">
                    <img :src="lugar.imagen" class="img-fluid rounded shadow-sm w-100 object-fit-cover" style="max-height: 320px" :alt="lugar.nombre" />
                </div>
                <div class="col-12 col-md-7">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h2 class="mb-0 fw-bold text-dark">{{ lugar.nombre }}</h2>
                        <span class="fs-4 fw-semibold text-primary">{{ convertirTemperatura(lugar.tempActual) }}</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <span class="badge bg-primary p-2 fs-7"><i class="fa-solid fa-droplet me-1"></i>Humedad: {{ lugar.humedad }}%</span>
                        <span class="badge bg-info p-2 fs-7"><i class="fa-solid fa-wind me-1"></i>Viento: {{ lugar.viento }} km/h</span>
                        <span class="badge bg-warning text-dark p-2 fs-7"><i class="fa-solid me-1" :class="lugar.icono"></i>{{ lugar.estadoActual }}</span>
                    </div>

                    <h5 class="fw-semibold text-secondary mb-3">Pronóstico Semanal</h5>
                    <ul class="list-group shadow-sm">
                        <template v-for="(dia, index) in lugar.pronosticoSemanal" :key="index">
                            <li class="list-group-item py-3">
                                <div class="row align-items-center g-0">
                                    <div class="col-3 fw-medium text-dark text-start">
                                        {{ dia.dia }}
                                    </div>
                                    <div class="col-2 text-center text-warning fs-5">
                                        <i class="fa-solid" :class="dia.icono"></i>
                                    </div>
                                    <div class="col-4 text-start text-muted small text-truncate">
                                        {{ dia.estado }}
                                    </div>
                                    <div class="col-3 text-end font-monospace">
                                        <span class="text-info fw-semibold">{{ convertirTemperatura(dia.min) }}</span>
                                        <span class="text-muted mx-1">/</span>
                                        <span class="text-danger fw-semibold">{{ convertirTemperatura(dia.max) }}</span>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>

            <div class="row mt-5" id="detail-week">
                <div class="col-12 col-lg-7 mb-4">
                    <div class="stats-wrapper shadow-sm border">
                        <table class="table custom-stats-table text-center mb-0">
                            <thead>
                                <tr>
                                    <th class="py-3 stats-header bg-primary text-white text-center" colspan="3"><i class="fa-solid fa-chart-line me-2"></i>ESTADÍSTICAS DE LA SEMANA</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="stats-labels text-muted small">
                                    <th scope="col" class="py-3 fw-bold">T° MÍNIMA</th>
                                    <th scope="col" class="py-3 fw-bold">T° MÁXIMA</th>
                                    <th scope="col" class="py-3 fw-bold">T° PROMEDIO</th>
                                </tr>
                                <tr class="stats-values fs-4">
                                    <td class="min-temp text-info fw-bold pb-3">{{ convertirTemperatura(stats.minima) }}</td>
                                    <td class="max-temp text-danger fw-bold pb-3">{{ convertirTemperatura(stats.maxima) }}</td>
                                    <td class="avg-temp text-success fw-bold pb-3">{{ convertirTemperatura(Number(stats.promedio)) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h5 class="mt-4 fw-semibold text-secondary">Alertas de Clima</h5>
                    <div v-if="Number(stats.promedio) > 22" class="alert alert-danger text-center fw-bold shadow-sm"><i class="fa-solid fa-fire me-2"></i>¡Alerta de calor detectada para la semana!</div>
                    <div v-else-if="stats.diasLluvia >= 2" class="alert alert-warning text-center fw-bold shadow-sm"><i class="fa-solid fa-cloud-showers-heavy me-2"></i>Alerta: Semana lluviosa detectada en la zona.</div>
                    <div v-else class="alert alert-success text-center shadow-sm"><i class="fa-solid fa-circle-check me-2"></i>Condiciones estables para la semana.</div>

                    <div class="alert bg-white border text-center shadow-sm mt-3 py-3">
                        <p class="mb-0 fs-5">
                            <i class="fa-solid fa-quote-left text-primary opacity-50 me-2"></i>
                            <strong>Resumen:</strong> {{ stats.resumen }}
                        </p>
                    </div>
                </div>

                <div class="col-12 col-lg-5 mb-5" id="cantidad-detalle">
                    <ul class="list-group shadow-sm">
                        <li class="list-group-item active bg-dark border-dark text-center fw-bold text-uppercase tracking-wide">Días por condición climática</li>
                        <li v-for="(cantidad, estado) in stats.conteo" :key="estado" class="list-group-item d-flex justify-content-between align-items-center py-3">
                            <span class="text-capitalize text-secondary fw-medium">{{ estado }}</span>
                            <span class="badge bg-secondary rounded-pill px-3 py-2 fs-7">{{ cantidad }} día(s)</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-danger text-center py-5 shadow-sm">
            <i class="fa-solid fa-circle-xmark d-block fs-1 mb-3"></i>
            <h3>Error 404: Comuna no localizada</h3>
            <p class="text-muted">El código identificador proporcionado no coincide con los registros históricos.</p>
        </div>
    </section>
</template>

<script>
export default {
    name: "DetailView",
    props: {
        id: { required: true }, // Mantenemos solo el ID que inyecta Vue Router
    },
    data() {
        return {
            lugares: [
                {
                    id: 1,
                    nombre: "Maipú",
                    tempActual: 18,
                    estadoActual: "Despejado",
                    icono: "fa-sun",
                    imagen: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500",
                    humedad: 45,
                    viento: 12,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-sun", estado: "Soleado", min: 10, max: 24 },
                        { dia: "Martes", icono: "fa-sun", estado: "Soleado", min: 11, max: 26 },
                        { dia: "Miércoles", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 12, max: 22 },
                        { dia: "Jueves", icono: "fa-cloud", estado: "Nublado", min: 9, max: 18 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 10, max: 25 },
                    ],
                },
                {
                    id: 2,
                    nombre: "Santiago",
                    tempActual: 16,
                    estadoActual: "Nublado",
                    icono: "fa-cloud",
                    imagen: "https://images.unsplash.com/photo-1573331519317-30b24326bb9a?w=500",
                    humedad: 65,
                    viento: 8,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud", estado: "Nublado", min: 9, max: 17 },
                        { dia: "Martes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 10, max: 19 },
                        { dia: "Miércoles", icono: "fa-sun", estado: "Soleado", min: 11, max: 22 },
                        { dia: "Jueves", icono: "fa-cloud-rain", estado: "Llovizna", min: 8, max: 14 },
                        { dia: "Viernes", icono: "fa-cloud", estado: "Nublado", min: 9, max: 16 },
                    ],
                },
                {
                    id: 3,
                    nombre: "Ñuñoa",
                    tempActual: 15,
                    estadoActual: "Llovizna",
                    icono: "fa-cloud-rain",
                    imagen: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500",
                    humedad: 80,
                    viento: 15,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud-rain", estado: "Llovizna", min: 8, max: 14 },
                        { dia: "Martes", icono: "fa-cloud-showers-heavy", estado: "Lluvia", min: 7, max: 12 },
                        { dia: "Miércoles", icono: "fa-cloud", estado: "Nublado", min: 9, max: 15 },
                        { dia: "Jueves", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 10, max: 18 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 11, max: 21 },
                    ],
                },
                {
                    id: 4,
                    nombre: "Providencia",
                    tempActual: 17,
                    estadoActual: "Despejado",
                    icono: "fa-sun",
                    imagen: "https://images.unsplash.com/photo-1568849676085-51415703900f?w=500",
                    humedad: 42,
                    viento: 10,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-sun", estado: "Soleado", min: 11, max: 25 },
                        { dia: "Martes", icono: "fa-sun", estado: "Soleado", min: 12, max: 27 },
                        { dia: "Miércoles", icono: "fa-sun", estado: "Soleado", min: 11, max: 24 },
                        { dia: "Jueves", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 10, max: 20 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 12, max: 26 },
                    ],
                },
                {
                    id: 5,
                    nombre: "Las Condes",
                    tempActual: 14,
                    estadoActual: "Parcialmente Nublado",
                    icono: "fa-cloud-sun",
                    imagen: "https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?w=500",
                    humedad: 50,
                    viento: 14,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 7, max: 21 },
                        { dia: "Martes", icono: "fa-sun", estado: "Soleado", min: 8, max: 23 },
                        { dia: "Miércoles", icono: "fa-cloud", estado: "Nublado", min: 9, max: 18 },
                        { dia: "Jueves", icono: "fa-cloud", estado: "Nublado", min: 6, max: 15 },
                        { dia: "Viernes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 8, max: 22 },
                    ],
                },
                {
                    id: 6,
                    nombre: "La Florida",
                    tempActual: 16,
                    estadoActual: "Nublado",
                    icono: "fa-cloud",
                    imagen: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=500",
                    humedad: 58,
                    viento: 11,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud", estado: "Nublado", min: 9, max: 19 },
                        { dia: "Martes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 10, max: 21 },
                        { dia: "Miércoles", icono: "fa-sun", estado: "Soleado", min: 11, max: 23 },
                        { dia: "Jueves", icono: "fa-cloud-rain", estado: "Llovizna", min: 7, max: 16 },
                        { dia: "Viernes", icono: "fa-cloud", estado: "Nublado", min: 8, max: 18 },
                    ],
                },
                {
                    id: 7,
                    nombre: "Puente Alto",
                    tempActual: 13,
                    estadoActual: "Llovizna",
                    icono: "fa-cloud-rain",
                    imagen: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500",
                    humedad: 75,
                    viento: 16,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud-rain", estado: "Llovizna", min: 6, max: 14 },
                        { dia: "Martes", icono: "fa-cloud-showers-heavy", estado: "Lluvia", min: 5, max: 11 },
                        { dia: "Miércoles", icono: "fa-cloud", estado: "Nublado", min: 7, max: 15 },
                        { dia: "Jueves", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 8, max: 17 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 9, max: 20 },
                    ],
                },
                {
                    id: 8,
                    nombre: "Pudahuel",
                    tempActual: 19,
                    estadoActual: "Despejado",
                    icono: "fa-sun",
                    imagen: "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=500",
                    humedad: 40,
                    viento: 13,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-sun", estado: "Soleado", min: 10, max: 25 },
                        { dia: "Martes", icono: "fa-sun", estado: "Soleado", min: 11, max: 27 },
                        { dia: "Miércoles", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 12, max: 23 },
                        { dia: "Jueves", icono: "fa-cloud", estado: "Nublado", min: 9, max: 19 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 10, max: 26 },
                    ],
                },
                {
                    id: 9,
                    nombre: "Cerrillos",
                    tempActual: 17,
                    estadoActual: "Parcialmente Nublado",
                    icono: "fa-cloud-sun",
                    imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
                    humedad: 48,
                    viento: 9,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-sun", estado: "Soleado", min: 9, max: 23 },
                        { dia: "Martes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 11, max: 24 },
                        { dia: "Miércoles", icono: "fa-cloud", estado: "Nublado", min: 10, max: 20 },
                        { dia: "Jueves", icono: "fa-cloud", estado: "Nublado", min: 8, max: 17 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 9, max: 24 },
                    ],
                },
                {
                    id: 10,
                    nombre: "Estación Central",
                    tempActual: 16,
                    estadoActual: "Nublado",
                    icono: "fa-cloud",
                    imagen: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=500",
                    humedad: 62,
                    viento: 10,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud", estado: "Nublado", min: 9, max: 18 },
                        { dia: "Martes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 10, max: 20 },
                        { dia: "Miércoles", icono: "fa-sun", estado: "Soleado", min: 11, max: 22 },
                        { dia: "Jueves", icono: "fa-cloud-rain", estado: "Llovizna", min: 8, max: 15 },
                        { dia: "Viernes", icono: "fa-cloud", estado: "Nublado", min: 9, max: 17 },
                    ],
                },
                {
                    id: 11,
                    nombre: "San Bernardo",
                    tempActual: 18,
                    estadoActual: "Despejado",
                    icono: "fa-sun",
                    imagen: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500",
                    humedad: 46,
                    viento: 11,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-sun", estado: "Soleado", min: 9, max: 24 },
                        { dia: "Martes", icono: "fa-sun", estado: "Soleado", min: 10, max: 25 },
                        { dia: "Miércoles", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 11, max: 22 },
                        { dia: "Jueves", icono: "fa-cloud", estado: "Nublado", min: 8, max: 18 },
                        { dia: "Viernes", icono: "fa-sun", estado: "Soleado", min: 9, max: 25 },
                    ],
                },
                {
                    id: 12,
                    nombre: "Vitacura",
                    tempActual: 15,
                    estadoActual: "Parcialmente Nublado",
                    icono: "fa-cloud-sun",
                    imagen: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500",
                    humedad: 52,
                    viento: 13,
                    pronosticoSemanal: [
                        { dia: "Lunes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 8, max: 22 },
                        { dia: "Martes", icono: "fa-sun", estado: "Soleado", min: 9, max: 24 },
                        { dia: "Miércoles", icono: "fa-cloud", estado: "Nublado", min: 10, max: 19 },
                        { dia: "Jueves", icono: "fa-cloud", estado: "Nublado", min: 7, max: 16 },
                        { dia: "Viernes", icono: "fa-cloud-sun", estado: "Parcialmente Nublado", min: 9, max: 23 },
                    ],
                },
            ],
        };
    },
    computed: {
        // Obtenemos la escala directamente del Store global, igual que en la Home
        unidad() {
            return this.$store.state.user?.preferencias?.unidad || "C";
        },
        lugar() {
            return this.lugares.find((l) => l.id === Number(this.id));
        },
        stats() {
            if (!this.lugar) return null;

            let minTemp = Infinity;
            let maxTemp = -Infinity;
            let sumaPromedios = 0;
            const conteoClimas = {};

            this.lugar.pronosticoSemanal.forEach((dia) => {
                if (dia.min < minTemp) minTemp = dia.min;
                if (dia.max > maxTemp) maxTemp = dia.max;
                sumaPromedios += (dia.min + dia.max) / 2;

                const clima = dia.estado;
                conteoClimas[clima] = (conteoClimas[clima] || 0) + 1;
            });

            const promedioSemanalNum = sumaPromedios / this.lugar.pronosticoSemanal.length;

            const diasLluvia = (conteoClimas["Lluvia"] || 0) + (conteoClimas["Llovizna"] || 0) + (conteoClimas["Chubascos"] || 0) + (conteoClimas["Tormenta Eléctrica"] || 0);
            const diasSol = (conteoClimas["Soleado"] || 0) + (conteoClimas["Despejado"] || 0);
            const diasNube = (conteoClimas["Nublado"] || 0) + (conteoClimas["Parcialmente Nublado"] || 0);

            let resumenTextual = "Semana con clima variado.";
            if (diasSol >= 4) resumenTextual = "Semana mayormente soleada";
            else if (diasLluvia >= 3) resumenTextual = "Semana con bastantes lluvias";
            else if (diasNube >= 4) resumenTextual = "Semana mayormente nublada";

            return {
                minima: minTemp,
                maxima: maxTemp,
                promedio: promedioSemanalNum.toFixed(1),
                conteo: conteoClimas,
                resumen: resumenTextual,
                diasLluvia,
            };
        },
    },
    methods: {
        convertirTemperatura(tempC) {
            if (this.unidad === "F") {
                const tempF = Math.round((tempC * 9) / 5 + 32);
                return `${tempF} °F`;
            }
            return `${tempC} °C`;
        },
    },
};
</script>
