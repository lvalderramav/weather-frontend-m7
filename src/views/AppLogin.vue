<template>
    <div class="auth-container">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label>Correo Electrónico:</label>
                <input v-model="form.email" type="email" placeholder="admin@clima.cl" required />
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input v-model="form.password" type="password" placeholder="••••••••" required />
            </div>
            <button type="submit" :disabled="authLoading">
                {{ authLoading ? "Comprobando..." : "Entrar" }}
            </button>
        </form>

        <p v-if="authError" class="error-msg">🚨 {{ authError }}</p>

        <p class="switch-route">¿No tienes cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const form = ref({ email: "", password: "" });

const authError = computed(() => store.state.authError);
const authLoading = computed(() => store.state.authLoading);

const handleLogin = async () => {
    const exito = await store.dispatch("login", {
        email: form.value.email,
        password: form.value.password,
    });
    if (exito) {
        router.push("/");
    }
};
</script>

<style scoped>
.auth-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 25px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: sans-serif;
}
.form-group {
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}
.form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}
button {
    width: 100%;
    padding: 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
button:disabled {
    background-color: #bdc3c7;
}
.error-msg {
    margin-top: 15px;
    padding: 10px;
    background-color: #fde8e8;
    color: #e74c3c;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
    text-align: center;
}
.switch-route {
    text-align: center;
    margin-top: 15px;
    font-size: 0.9em;
}
</style>
