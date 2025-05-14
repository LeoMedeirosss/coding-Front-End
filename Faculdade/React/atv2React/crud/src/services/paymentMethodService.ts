import axios from 'axios';
import { PaymentMethod } from '../types/PaymentMethod';

// Você pode alterar esta URL para apontar para seu backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/payment-methods';

// Configurando o axios para mostrar mais informações sobre erros
axios.interceptors.request.use(request => {
    console.log('Iniciando requisição:', request);
    return request;
});

axios.interceptors.response.use(
    response => {
        console.log('Resposta recebida:', response);
        return response;
    },
    error => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Não foi possível conectar ao servidor. Verifique se o backend está rodando em:', API_URL);
        } else {
            console.error('Erro na requisição:', error.response || error);
        }
        return Promise.reject(error);
    }
);

export const paymentMethodService = {
    getAll: async (): Promise<PaymentMethod[]> => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar meios de pagamento:', error);
            throw error;
        }
    },

    getById: async (id: number): Promise<PaymentMethod> => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar meio de pagamento ${id}:`, error);
            throw error;
        }
    },

    create: async (paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
        try {
            console.log('Criando meio de pagamento:', paymentMethod);
            const response = await axios.post(API_URL, paymentMethod);
            console.log('Meio de pagamento criado:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar meio de pagamento:', error);
            throw error;
        }
    },

    update: async (id: number, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, paymentMethod);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar meio de pagamento ${id}:`, error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Erro ao excluir meio de pagamento ${id}:`, error);
            throw error;
        }
    }
}; 