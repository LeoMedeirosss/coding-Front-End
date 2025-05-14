import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { PaymentMethod } from '../types/PaymentMethod';
import { paymentMethodService } from '../services/paymentMethodService';

export const PaymentMethodList: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();

    const loadPaymentMethods = async () => {
        try {
            const data = await paymentMethodService.getAll();
            setPaymentMethods(data);
        } catch (error) {
            console.error('Erro ao carregar meios de pagamento:', error);
        }
    };

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const handleView = (id: number) => {
        navigate(`/view/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedId) {
            try {
                await paymentMethodService.delete(selectedId);
                await loadPaymentMethods();
            } catch (error) {
                console.error('Erro ao excluir meio de pagamento:', error);
            }
        }
        setDeleteDialogOpen(false);
        setSelectedId(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Meios de Pagamento</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/create')}
                style={{ marginBottom: '20px' }}
            >
                Incluir Novo
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Valor Máximo</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentMethods.map((method) => (
                            <TableRow key={method.id}>
                                <TableCell>{method.name}</TableCell>
                                <TableCell>R$ {method.maxValue.toFixed(2)}</TableCell>
                                <TableCell>
                                    {method.type === 'ELECTRONIC' ? 'Eletrônico' : 'Físico'}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleView(method.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEdit(method.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(method.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja excluir este meio de pagamento?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}; 