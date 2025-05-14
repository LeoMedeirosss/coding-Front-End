import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    Alert,
} from '@mui/material';
import { PaymentMethod, PaymentMethodType } from '../types/PaymentMethod';
import { paymentMethodService } from '../services/paymentMethodService';

const initialPaymentMethod: Omit<PaymentMethod, 'id'> = {
    name: '',
    maxValue: 0,
    type: 'ELECTRONIC',
};

export const PaymentMethodCreate: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState<Omit<PaymentMethod, 'id'>>(initialPaymentMethod);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (field: keyof Omit<PaymentMethod, 'id'>) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        console.log('Campo alterado:', field, event.target.value);
        setPaymentMethod({
            ...paymentMethod,
            [field]: field === 'maxValue' 
                ? parseFloat(event.target.value) || 0
                : event.target.value,
        });
    };

    const handleClear = () => {
        console.log('Limpando formulário');
        setPaymentMethod(initialPaymentMethod);
        setError('');
    };

    const validateForm = (): boolean => {
        console.log('Validando formulário:', paymentMethod);
        if (!paymentMethod.name.trim()) {
            setError('O nome é obrigatório');
            return false;
        }
        if (paymentMethod.maxValue <= 0) {
            setError('O valor máximo deve ser maior que zero');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        console.log('Botão Incluir clicado');
        try {
            if (!validateForm()) {
                console.log('Formulário inválido');
                return;
            }

            console.log('Enviando dados:', paymentMethod);
            const response = await paymentMethodService.create(paymentMethod);
            console.log('Resposta do servidor:', response);
            navigate('/');
        } catch (error) {
            console.error('Erro ao criar meio de pagamento:', error);
            setError('Erro ao criar meio de pagamento. Tente novamente.');
        }
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Novo Meio de Pagamento
            </Typography>

            {error && (
                <Alert severity="error" sx={{ marginBottom: '20px' }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ padding: '20px' }}>
                <TextField
                    fullWidth
                    label="Nome"
                    value={paymentMethod.name}
                    onChange={handleChange('name')}
                    margin="normal"
                    required
                    error={!paymentMethod.name.trim()}
                    helperText={!paymentMethod.name.trim() ? 'Nome é obrigatório' : ''}
                />
                <TextField
                    fullWidth
                    label="Valor Máximo"
                    type="number"
                    value={paymentMethod.maxValue}
                    onChange={handleChange('maxValue')}
                    margin="normal"
                    required
                    error={paymentMethod.maxValue <= 0}
                    helperText={paymentMethod.maxValue <= 0 ? 'Valor deve ser maior que zero' : ''}
                    InputProps={{
                        startAdornment: 'R$',
                    }}
                />
                <TextField
                    fullWidth
                    select
                    label="Tipo"
                    value={paymentMethod.type}
                    onChange={handleChange('type')}
                    margin="normal"
                    required
                >
                    <MenuItem value="ELECTRONIC">Eletrônico</MenuItem>
                    <MenuItem value="PHYSICAL">Físico</MenuItem>
                </TextField>
            </Paper>

            <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        console.log('Botão Incluir clicado - inline');
                        handleSave();
                    }}
                >
                    Incluir
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClear}
                >
                    Limpar
                </Button>
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