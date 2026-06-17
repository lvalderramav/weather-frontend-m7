/*
 *  JS SE ENCARGA SOLO DE LA COMUNICACIÓN CON LA API -- OPEN METEO --
 */

class ApiClient {
    constructor(urlBase) {
        this.urlBase = urlBase;
    }
    // DATOS METEOROLÓGICOS ASINCRÓNOS
    async fetchWeatherData() {
        try {
            const response = await fetch(this.urlBase);
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error detectado en ApiClient:", error);
            throw error;
        }
    }
}
