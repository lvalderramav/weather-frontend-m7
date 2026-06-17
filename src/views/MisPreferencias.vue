<template>
    <div class="prefs-container">
        <h2>Preferencias del Sistema</h2>
        <p>Personaliza cómo deseas visualizar los indicadores meteorológicos en tu cuenta.</p>

        <div class="pref-row">
            <label><strong>Unidad de Medida de Temperatura:</strong></label>
            <select :value="userPreferences.unidad" @change="cambiarUnidad($event.target.value)">
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
            </select>
        </div>

        <div class="favoritos-box">
            <h3>Tus Localidades Favoritas Marcadas:</h3>
            <ul v-if="userFavorites.length">
                <li v-for="ciudad in userFavorites" :key="ciudad">
                    🏙️ {{ ciudad }}
                    <button class="btn-remove" @click="eliminarFavorito(ciudad)">Quitar</button>
                </li>
            </ul>
            <p v-else class="no-favs">No has agregado localidades a tus favoritos todavía.</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const userPreferences = computed(() => store.state.user?.preferencias || { unidad: "C" });
const userFavorites = computed(() => store.state.user?.favoritos || []);

const cambiarUnidad = (unidad) => {
    store.commit("UPDATE_PREFERENCES", { unidad });
};

const eliminarFavorito = (ciudad) => {
    store.commit("TOGGLE_FAVORITO", ciudad);
};
</script>

<style scoped>
.prefs-container {
    max-width: 500px;
    margin: 30px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: sans-serif;
}
.pref-row {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
select {
    padding: 6px 12px;
    font-size: 1em;
}
.favoritos-box {
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 15px;
}
ul {
    list-style: none;
    padding: 0;
}
li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #f1f1f1;
}
.btn-remove {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
}
.no-favs {
    color: #7f8c8d;
    font-style: italic;
}
</style>
