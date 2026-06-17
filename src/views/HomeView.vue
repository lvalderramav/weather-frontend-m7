<template>
    <div id="vista-clima">
        <div class="row mb-4 align-items-center g-3">
            <div class="col-12 col-md-8">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" v-model="busqueda" class="form-control border-start-0 ps-0" placeholder="Buscar comuna de la RM (ej: Maipú, Ñuñoa...)" />
                </div>
            </div>

            <div class="col-12 col-md-4 text-md-end">
                <label class="me-2 fw-medium text-secondary">Escala:</label>
                <div class="btn-group" role="group">
                    <input type="radio" class="btn-check" id="celsius" value="C" v-model="unidadLocal" />
                    <label class="btn btn-outline-primary" for="celsius">°C</label>

                    <input type="radio" class="btn-check" id="fahrenheit" value="F" v-model="unidadLocal" />
                    <label class="btn btn-outline-primary" for="fahrenheit">°F</label>
                </div>
            </div>
        </div>

        <div v-if="lugaresFiltrados.length === 0" class="alert alert-warning text-center my-4 py-4 shadow-sm">
            <i class="fa-solid fa-circle-info me-2 fs-4 align-middle"></i>
            No se encontró ninguna comuna que coincida con "{{ busqueda }}".
        </div>

        <div v-else class="row" id="tiempo-container">
            <div v-for="lugar in lugaresFiltrados" :key="lugar.id" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <router-link :to="{ name: 'detalle', params: { id: lugar.id } }" class="text-decoration-none d-block h-100">
                    <article class="place-card card h-100 shadow-sm" :class="obtenerClaseEstilo(lugar.estadoActual)">
                        <img :src="lugar.imagen" class="card-img-top object-fit-cover" style="height: 180px" :alt="lugar.nombre" />

                        <div class="card-body d-flex flex-column">
                            <h5 class="place-card__name text-dark mb-1 fw-bold fs-6">{{ lugar.nombre }}</h5>
                            <p class="place-card__temp mb-3">
                                <span class="fw-semibold text-secondary small"> {{ mostrarTemperatura(lugar.tempActual) }} — {{ lugar.estadoActual }} </span>
                            </p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <i class="fa-solid text-warning fs-4" :class="lugar.icono"></i>
                                <span class="btn btn-sm btn-outline-secondary rounded-pill px-2 py-0 small" style="font-size: 0.8rem">Ver reporte</span>
                            </div>
                        </div>
                    </article>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomeView",
    data() {
        return {
            busqueda: "",
            unidadAnonima: "C",
            lugares: [
                { id: 1, nombre: "Maipú", tempActual: 18, estadoActual: "Despejado", icono: "fa-sun", imagen: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500" },
                { id: 2, nombre: "Santiago", tempActual: 16, estadoActual: "Nublado", icono: "fa-cloud", imagen: "https://images.unsplash.com/photo-1573331519317-30b24326bb9a?w=500" },
                { id: 3, nombre: "Ñuñoa", tempActual: 15, estadoActual: "Llovizna", icono: "fa-cloud-rain", imagen: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500" },
                { id: 4, nombre: "Providencia", tempActual: 17, estadoActual: "Despejado", icono: "fa-sun", imagen: "https://images.unsplash.com/photo-1568849676085-51415703900f?w=500" },
                { id: 5, nombre: "Las Condes", tempActual: 14, estadoActual: "Parcialmente Nublado", icono: "fa-cloud-sun", imagen: "https://images.unsplash.com/photo-1508674861872-a51e06c50c9b?w=500" },
                { id: 6, nombre: "La Florida", tempActual: 16, estadoActual: "Nublado", icono: "fa-cloud", imagen: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=500" },
                { id: 7, nombre: "Puente Alto", tempActual: 13, estadoActual: "Llovizna", icono: "fa-cloud-rain", imagen: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500" },
                { id: 8, nombre: "Pudahuel", tempActual: 19, estadoActual: "Despejado", icono: "fa-sun", imagen: "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=500" },
                { id: 9, nombre: "Cerrillos", tempActual: 17, estadoActual: "Parcialmente Nublado", icono: "fa-cloud-sun", imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500" },
                { id: 10, nombre: "Estación Central", tempActual: 16, estadoActual: "Nublado", icono: "fa-cloud", imagen: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=500" },
                { id: 11, nombre: "San Bernardo", tempActual: 18, estadoActual: "Despejado", icono: "fa-sun", imagen: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500" },
                { id: 12, nombre: "Vitacura", tempActual: 15, estadoActual: "Parcialmente Nublado", icono: "fa-cloud-sun", imagen: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500" },
            ],
        };
    },
    computed: {
        unidadActiva() {
            return this.$store.state.user?.preferencias?.unidad || this.unidadAnonima;
        },

        unidadLocal: {
            get() {
                return this.unidadActiva;
            },
            set(val) {
                if (this.$store.state.isAuthenticated) {
                    this.$store.commit("UPDATE_PREFERENCES", { unidad: val });
                } else {
                    this.unidadAnonima = val;
                }
            },
        },

        lugaresFiltrados() {
            return this.lugares.filter((lugar) => lugar.nombre.toLowerCase().includes(this.busqueda.trim().toLowerCase()));
        },
    },
    methods: {
        mostrarTemperatura(tempC) {
            if (this.unidadActiva === "F") {
                const tempF = Math.round((tempC * 9) / 5 + 32);
                return `${tempF} °F`;
            }
            return `${tempC} °C`;
        },
        obtenerClaseEstilo(estado) {
            const lluvia = ["Lluvia", "Llovizna", "Chubascos", "Tormenta Eléctrica"];
            if (lluvia.includes(estado)) return "place-card--rainy";
            return "place-card--sunny";
        },
    },
};
</script>
