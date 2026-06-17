<template>
    <div class="auth-container">
        <h2>Registro de Usuario</h2>
        <form @submit.prevent="handleRegister">
            <div class="form-group">
                <label>Nombre Completo: </label>
                <input v-model="form.nombre" type="text" placeholder="Juan Pérez" required />
            </div>
            <div class="form-group">
                <label>Correo Electrónico: </label>
                <input v-model="form.email" type="email" placeholder="juan@correo.com" required />
            </div>
            <div class="form-group">
                <label>Contraseña: </label>
                <input v-model="form.password" type="password" placeholder="Mínimo 4 caracteres" required />
            </div>
            <button type="submit">Crear Cuenta</button>
        </form>
        <p v-if="authError" class="error-msg">{{ authError }}</p>
        <p class="switch-route">¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const form = ref({ nombre: "", email: "", password: "" });
const authError = computed(() => store.state.authError);

const handleRegister = async () => {
    store.commit("SET_AUTH_ERROR", null);
    const exito = await store.dispatch("register", { ...form.value });
    if (exito) {
        alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
        router.push("/login");
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
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}
.error-msg {
    margin-top: 15px;
    padding: 10px;
    background-color: #fde8e8;
    color: #e74c3c;
    border-radius: 4px;
    text-align: center;
}
.switch-route {
    text-align: center;
    margin-top: 15px;
    font-size: 0.9em;
}
</style>
