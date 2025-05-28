import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, Button, Typography, Paper, Box, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const PaymentMethodCreate = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState({
    name: '',
    maxValue: '',
    type: ''
  });

  const handleChange = (e) => {
    setMethod({
      ...method,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/payment-methods', method);
    navigate('/');
  };

  const handleClear = () => {
    setMethod({
      name: '',
      maxValue: '',
      type: ''
    });
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Novo Método de Pagamento
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          name="name"
          value={method.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Valor Máximo"
          name="maxValue"
          type="number"
          value={method.maxValue}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Tipo</InputLabel>
          <Select
            name="type"
            value={method.type}
            onChange={handleChange}
          >
            <MenuItem value="eletrônico">Eletrônico</MenuItem>
            <MenuItem value="físico">Físico</MenuItem>
          </Select>
        </FormControl>
        
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={handleClear}>
            Limpar
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Adicionar
          </Button>
          <Button variant="contained" onClick={() => navigate('/')}>
            Voltar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PaymentMethodCreate;