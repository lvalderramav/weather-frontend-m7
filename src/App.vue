<template>
    <div id="app">
        <nav class="navbar">
            <div class="brand">App Clima M7</div>
            <div class="nav-links">
                <router-link to="/">Inicio</router-link>

                <router-link v-if="isLoggedIn" to="/preferencias">Mis Preferencias</router-link>

                <span v-if="isLoggedIn" class="user-welcome">
                    Hola, <strong>{{ currentUser.nombre }}</strong>
                </span>

                <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">Cerrar Sesión</button>

                <router-link v-else to="/login" class="login-link">Iniciar Sesión</router-link>
            </div>
        </nav>

        <router-view />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.state.isAuthenticated);
const currentUser = computed(() => store.state.user);

const handleLogout = () => {
    store.dispatch("logout");
    router.push("/login");
};
</script>

<style>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c3e50;
    padding: 15px 30px;
    color: white;
    font-family: sans-serif;
}
.nav-links {
    display: flex;
    align-items: center;
    gap: 15px;
}
.navbar a {
    color: white;
    text-decoration: none;
    font-weight: bold;
}
.navbar a.router-link-exact-active {
    color: #3498db;
}
.user-welcome {
    margin-left: 10px;
    color: #ecf0f1;
}
.logout-btn {
    background-color: #c0392b;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
.login-link {
    background-color: #27ae60;
    padding: 6px 12px;
    border-radius: 4px;
}
</style>
