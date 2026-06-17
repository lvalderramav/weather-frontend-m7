🌤️ Aplicación Meteorológica de la RM — Portafolio Módulo 7
Esta es una aplicación web SPA (Single Page Application) responsiva desarrollada con Vue 3 y Vite. La plataforma permite visualizar de manera detallada el estado del clima en 12 comunas de la Región Metropolitana, ofreciendo filtrado en tiempo real, cambio de unidades de escala meteorológica y un ecosistema de gestión de cuentas de usuario centralizado.

👥 1. Descripción del Sistema de Usuarios
La aplicación cuenta con un sistema dinámico de autenticación y persistencia de estados simulado a través de Vuex. El sistema almacena y gestiona de manera local los siguientes datos por cada usuario registrado:

Datos de Identificación y Seguridad:

nombre: Nombre completo del usuario para la personalización de la interfaz.

email: Correo electrónico único utilizado como identificador de inicio de sesión.

password: Contraseña de acceso (validación mínima de 4 caracteres).

Preferencias del Sistema:

preferencias.unidad: Escala métrica activa seleccionada por el usuario (C para Celsius o F para Fahrenheit).

Sección de Interés:

favoritos: Un arreglo (Array) de strings que contiene los nombres de las comunas que el usuario ha marcado como preferidas.

🔑 Credenciales de Acceso para Evaluación
Para realizar pruebas rápidas sobre los módulos restringidos sin necesidad de crear una cuenta nueva, puedes utilizar el siguiente usuario preconfigurado:

Correo Electrónico: admin@clima.cl

Contraseña: 1234

🛣️ 2. Rutas Relacionadas con la Autenticación y Control
El enrutamiento de la aplicación está controlado por Vue Router y contempla las siguientes rutas clave asociadas al ecosistema de usuarios:

/login (AppLogin.vue): Formulario de ingreso al sistema. Valida las credenciales contra el estado de Vuex y redirige al inicio en caso de éxito.

/registro (AppRegistro.vue): Formulario de creación de cuentas para registrar nuevos usuarios de manera dinámica dentro de la sesión actual.

/preferencias o similar (MisPreferencias.vue): Panel privado accesible para usuarios autenticados, donde se administra la escala global de temperatura (°C / °F) y se listan o eliminan las comunas marcadas como favoritas.

🔗 3. Enlace al Repositorio Público
El código fuente completo, el historial de confirmaciones (commits) y la arquitectura del proyecto se encuentran alojados en el siguiente enlace:

👉 Repositorio Público de GitHub - Proyecto Clima RM (Nota: Reemplaza este enlace de marcador de posición por la URL final de tu repositorio público)

🛠️ 4. Instrucciones Básicas para Ejecutar el Proyecto
Sigue estos comandos en tu terminal para clonar, instalar y levantar el entorno de desarrollo local utilizando Vite:

1. Navegar a la carpeta raíz del proyecto:
   cd "Portafolio Módulo 7"

2. Instalar los módulos y dependencias de Node.js:
   npm install

3. Iniciar el servidor de desarrollo local:
   npm run dev

4. Visualizar en el navegador:
   Abre la dirección indicada en la terminal (usualmente de forma nativa en http://localhost:5173).

## 🚀 Instrucciones de Ejecución

Para levantar el proyecto en un entorno local, asegúrate de contar con Node.js instalado y ejecuta los siguientes comandos:

```bash
# 1. Clonar el repositorio público
git clone [https://github.com/lvalderramav/weather-frontend-m7.git](https://github.com/lvalderramav/weather-frontend-m7.git)

# 2. Ingresar a la carpeta raíz del proyecto
cd weather-frontend-m7

# 3. Instalar las dependencias requeridas
npm install

# 4. Compilar los estilos SCSS (En caso de desarrollo)
npm run sass:watch

# 5. Levantar el servidor de desarrollo local
npm run dev
```

# weather-frontend-m7
