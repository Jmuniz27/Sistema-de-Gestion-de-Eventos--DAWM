/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Cliente HTTP para API REST
 * ============================================
 *
 * Este archivo proporciona funciones para hacer peticiones HTTP
 * a la API del backend usando Fetch API.
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const API_CONFIG = {
    BASE_URL: window.location.origin + '/api/v1',
    TIMEOUT: 30000, // 30 segundos
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// ============================================
// CLASE API CLIENT
// ============================================
class APIClient {
    constructor(config = API_CONFIG) {
        this.baseURL = config.BASE_URL;
        this.timeout = config.TIMEOUT;
        this.headers = config.HEADERS;
    }

    /**
     * Realizar petición HTTP con timeout
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('La petición ha excedido el tiempo límite');
            }
            throw error;
        }
    }

    /**
     * Procesar respuesta
     */
    async processResponse(response) {
        const contentType = response.headers.get('content-type');

        // Si es JSON, parsearlo
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error: ${response.status}`);
            }

            return data;
        }

        // Si es otro tipo de contenido (PDF, Excel, etc.)
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return response;
    }

    /**
     * GET request
     */
    async get(endpoint, params = {}) {
        try {
            // Construir URL con parámetros
            const url = new URL(`${this.baseURL}${endpoint}`);
            Object.keys(params).forEach(key =>
                url.searchParams.append(key, params[key])
            );

            const response = await this.fetchWithTimeout(url, {
                method: 'GET',
                headers: this.headers
            });

            return await this.processResponse(response);
        } catch (error) {
            console.error('GET Error:', error);
            throw error;
        }
    }

    /**
     * POST request
     */
    async post(endpoint, data = {}) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseURL}${endpoint}`,
                {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(data)
                }
            );

            return await this.processResponse(response);
        } catch (error) {
            console.error('POST Error:', error);
            throw error;
        }
    }

    /**
     * PUT request
     */
    async put(endpoint, data = {}) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseURL}${endpoint}`,
                {
                    method: 'PUT',
                    headers: this.headers,
                    body: JSON.stringify(data)
                }
            );

            return await this.processResponse(response);
        } catch (error) {
            console.error('PUT Error:', error);
            throw error;
        }
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseURL}${endpoint}`,
                {
                    method: 'DELETE',
                    headers: this.headers
                }
            );

            return await this.processResponse(response);
        } catch (error) {
            console.error('DELETE Error:', error);
            throw error;
        }
    }

    /**
     * Descargar archivo
     */
    async downloadFile(endpoint, params = {}, filename) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            Object.keys(params).forEach(key =>
                url.searchParams.append(key, params[key])
            );

            const response = await this.fetchWithTimeout(url, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`Error al descargar: ${response.statusText}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error('Download Error:', error);
            throw error;
        }
    }
}

// ============================================
// INSTANCIA GLOBAL
// ============================================
const apiClient = new APIClient();

// ============================================
// FUNCIONES ESPECÍFICAS POR MÓDULO
// ============================================

/**
 * API de Clientes
 */
const ClientesAPI = {
    getAll: (params) => apiClient.get('/clientes', params),
    getById: (id) => apiClient.get(`/clientes/${id}`),
    create: (data) => apiClient.post('/clientes', data),
    update: (id, data) => apiClient.put(`/clientes/${id}`, data),
    delete: (id) => apiClient.delete(`/clientes/${id}`),
    export: (format, params) =>
        apiClient.downloadFile(
            `/clientes/export/${format}`,
            params,
            `clientes.${format}`
        )
};

/**
 * API de Eventos (placeholder - a implementar)
 */
const EventosAPI = {
    getAll: (params) => apiClient.get('/eventos', params),
    getById: (id) => apiClient.get(`/eventos/${id}`),
    create: (data) => apiClient.post('/eventos', data),
    update: (id, data) => apiClient.put(`/eventos/${id}`, data),
    delete: (id) => apiClient.delete(`/eventos/${id}`)
};

/**
 * API de Boletos (placeholder - a implementar)
 */
const BoletosAPI = {
    getAll: (params) => apiClient.get('/boletos', params),
    getById: (id) => apiClient.get(`/boletos/${id}`),
    create: (data) => apiClient.post('/boletos', data),
    update: (id, data) => apiClient.put(`/boletos/${id}`, data),
    delete: (id) => apiClient.delete(`/boletos/${id}`)
};
