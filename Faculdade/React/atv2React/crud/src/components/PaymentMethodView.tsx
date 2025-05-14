import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Button,
    Box,
    TextField,
} from '@mui/material';
import { PaymentMethod } from '../types/PaymentMethod';
import { paymentMethodService } from '../services/paymentMethodService';

export const PaymentMethodView: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const loadPaymentMethod = async () => {
            try {
                if (id) {
                    const data = await paymentMethodService.getById(parseInt(id));
                    setPaymentMethod(data);
                }
            } catch (error) {
                console.error('Erro ao carregar meio de pagamento:', error);
            }
        };

        loadPaymentMethod();
    }, [id]);

    if (!paymentMethod) {
        return <Typography>Carregando...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Detalhes do Meio de Pagamento
            </Typography>

            <Paper sx={{ padding: '20px' }}>
                <TextField
                    fullWidth
                    label="Nome"
                    value={paymentMethod.name}
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Valor Máximo"
                    value={`R$ ${paymentMethod.maxValue.toFixed(2)}`}
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    fullWidth
                    label="Tipo"
                    value={paymentMethod.type === 'ELECTRONIC' ? 'Eletrônico' : 'Físico'}
                    margin="normal"
                    InputProps={{ readOnly: true }}
                />
            </Paper>

            <Box sx={{ marginTop: '20px' }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                >
                    Voltar
                </Button>
            </Box>
        </Box>
    );
}; 