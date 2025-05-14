import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
} from '@mui/material';
import { PaymentMethod, PaymentMethodType } from '../types/PaymentMethod';
import { paymentMethodService } from '../services/paymentMethodService';

export const PaymentMethodEdit: React.FC = () => {
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

    const handleChange = (field: keyof PaymentMethod) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (paymentMethod) {
            setPaymentMethod({
                ...paymentMethod,
                [field]: field === 'maxValue' 
                    ? parseFloat(event.target.value) 
                    : event.target.value,
            });
        }
    };

    const handleClear = () => {
        if (paymentMethod) {
            setPaymentMethod({
                ...paymentMethod,
                name: '',
                maxValue: 0,
                type: 'ELECTRONIC',
            });
        }
    };

    const handleSave = async () => {
        try {
            if (paymentMethod && id) {
                await paymentMethodService.update(parseInt(id), {
                    name: paymentMethod.name,
                    maxValue: paymentMethod.maxValue,
                    type: paymentMethod.type,
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Erro ao atualizar meio de pagamento:', error);
        }
    };

    if (!paymentMethod) {
        return <Typography>Carregando...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Editar Meio de Pagamento
            </Typography>

            <Paper sx={{ padding: '20px' }}>
                <TextField
                    fullWidth
                    label="Nome"
                    value={paymentMethod.name}
                    onChange={handleChange('name')}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Valor Máximo"
                    type="number"
                    value={paymentMethod.maxValue}
                    onChange={handleChange('maxValue')}
                    margin="normal"
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
                >
                    <MenuItem value="ELECTRONIC">Eletrônico</MenuItem>
                    <MenuItem value="PHYSICAL">Físico</MenuItem>
                </TextField>
            </Paper>

            <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                >
                    Salvar
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