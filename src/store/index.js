import { createStore } from "vuex";

export default createStore({
    strict: process.env.NODE_ENV !== "production",
    state: {
        usuariosRegistrados: [
            {
                email: "admin@clima.cl",
                password: "1234",
                nombre: "Administrador",
                preferencias: { unidad: "C", tema: "claro" },
                favoritos: ["Santiago", "Maipú"],
            },
        ],
        user: null,
        isAuthenticated: false,
        authError: null,
        authLoading: false,
    },
    mutations: {
        SET_AUTH_LOADING(state, status) {
            state.authLoading = status;
        },
        SET_AUTH_ERROR(state, message) {
            state.authError = message;
        },
        LOGIN_SUCCESS(state, usuario) {
            state.user = usuario;
            state.isAuthenticated = true;
            state.authError = null;
        },
        LOGOUT(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.authError = null;
        },
        REGISTRAR_USUARIO(state, nuevoUsuario) {
            state.usuariosRegistrados.push(nuevoUsuario);
        },
        UPDATE_PREFERENCES(state, nuevasPrefs) {
            if (state.user) {
                state.user.preferencias = { ...state.user.preferencias, ...nuevasPrefs };
            }
        },
        TOGGLE_FAVORITO(state, ciudad) {
            if (state.user) {
                const index = state.user.favoritos.indexOf(ciudad);
                if (index === -1) {
                    state.user.favoritos.push(ciudad);
                } else {
                    state.user.favoritos.splice(index, 1);
                }
            }
        },
    },
    actions: {
        async login({ commit, state }, { email, password }) {
            commit("SET_AUTH_LOADING", true);
            commit("SET_AUTH_ERROR", null);

            return new Promise((resolve) => {
                setTimeout(() => {
                    const usuarioEncontrado = state.usuariosRegistrados.find((u) => u.email === email && u.password === password);

                    if (usuarioEncontrado) {
                        commit("LOGIN_SUCCESS", JSON.parse(JSON.stringify(usuarioEncontrado)));
                        commit("SET_AUTH_LOADING", false);
                        resolve(true);
                    } else {
                        commit("SET_AUTH_ERROR", "El correo electrónico o la contraseña son incorrectos.");
                        commit("SET_AUTH_LOADING", false);
                        resolve(false);
                    }
                }, 800);
            });
        },
        register({ commit, state }, nuevoUsuario) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const existe = state.usuariosRegistrados.some((u) => u.email === nuevoUsuario.email);
                    if (existe) {
                        commit("SET_AUTH_ERROR", "Este correo ya se encuentra registrado.");
                        resolve(false);
                    } else {
                        const usuarioCompleto = {
                            ...nuevoUsuario,
                            preferencias: { unidad: "C", tema: "claro" },
                            favoritos: [],
                        };
                        commit("REGISTRAR_USUARIO", usuarioCompleto);
                        resolve(true);
                    }
                }, 500);
            });
        },
        logout({ commit }) {
            commit("LOGOUT");
        },
    },
});
