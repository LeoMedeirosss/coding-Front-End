import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Typography, Paper, Box, Button, 
  List, ListItem, ListItemText 
} from '@mui/material';

const PaymentMethodDetail = () => {
  const { id } = useParams();
  const [method, setMethod] = useState(null);

  useEffect(() => {
    const fetchMethod = async () => {
      const response = await axios.get(`http://localhost:3001/api/payment-methods/${id}`);
      setMethod(response.data);
    };
    fetchMethod();
  }, [id]);

  if (!method) return <div>Carregando...</div>;

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Detalhes do Método de Pagamento
      </Typography>
      
      <List>
        <ListItem>
          <ListItemText primary="Nome" secondary={method.name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Valor Máximo" secondary={method.maxValue} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Tipo" secondary={method.type} />
        </ListItem>
      </List>
      
      <Box mt={2}>
        <Button variant="contained" component={Link} to="/">
          Voltar
        </Button>
      </Box>
    </Paper>
  );
};

export default PaymentMethodDetail;