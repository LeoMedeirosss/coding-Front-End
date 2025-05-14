import express, { Request, Response } from 'express';
import cors from 'cors';
import { PaymentMethod } from './types/PaymentMethod';

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API de Meios de Pagamento está funcionando!' });
});

// Banco de dados em memória (simulado)
let paymentMethods: PaymentMethod[] = [];
let nextId = 1;

// Rotas
app.get('/api/payment-methods', (req: Request, res: Response) => {
    console.log('GET /api/payment-methods - Listando todos os meios de pagamento');
    res.json(paymentMethods);
});

app.get('/api/payment-methods/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(`GET /api/payment-methods/${id} - Buscando meio de pagamento`);
    
    const paymentMethod = paymentMethods.find(pm => pm.id === id);
    
    if (!paymentMethod) {
        return res.status(404).json({ message: 'Meio de pagamento não encontrado' });
    }
    
    res.json(paymentMethod);
});

app.post('/api/payment-methods', (req: Request, res: Response) => {
    console.log('POST /api/payment-methods - Criando novo meio de pagamento:', req.body);
    const { name, maxValue, type } = req.body;
    
    if (!name || !maxValue || !type) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    const newPaymentMethod: PaymentMethod = {
        id: nextId++,
        name,
        maxValue: Number(maxValue),
        type
    };
    
    paymentMethods.push(newPaymentMethod);
    res.status(201).json(newPaymentMethod);
});

app.put('/api/payment-methods/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/payment-methods/${id} - Atualizando meio de pagamento:`, req.body);
    
    const { name, maxValue, type } = req.body;
    
    if (!name || !maxValue || !type) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    const index = paymentMethods.findIndex(pm => pm.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Meio de pagamento não encontrado' });
    }
    
    const updatedPaymentMethod: PaymentMethod = {
        id,
        name,
        maxValue: Number(maxValue),
        type
    };
    
    paymentMethods[index] = updatedPaymentMethod;
    res.json(updatedPaymentMethod);
});

app.delete('/api/payment-methods/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/payment-methods/${id} - Excluindo meio de pagamento`);
    
    const index = paymentMethods.findIndex(pm => pm.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Meio de pagamento não encontrado' });
    }
    
    paymentMethods = paymentMethods.filter(pm => pm.id !== id);
    res.status(204).send();
});

// Tratamento de rotas não encontradas
app.use((req: Request, res: Response) => {
    console.log(`Rota não encontrada: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Rotas disponíveis:');
    console.log('- GET /');
    console.log('- GET /api/payment-methods');
    console.log('- GET /api/payment-methods/:id');
    console.log('- POST /api/payment-methods');
    console.log('- PUT /api/payment-methods/:id');
    console.log('- DELETE /api/payment-methods/:id');
}); 