import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TextField, Button, Typography, Paper, Box, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const PaymentMethodEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState({
    name: '',
    maxValue: '',
    type: ''
  });

  useEffect(() => {
    const fetchMethod = async () => {
      const response = await axios.get(`http://localhost:3001/api/payment-methods/${id}`);
      setMethod(response.data);
    };
    fetchMethod();
  }, [id]);

  const handleChange = (e) => {
    setMethod({
      ...method,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3001/api/payment-methods/${id}`, method);
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
        Editar Método de Pagamento
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
            Salvar
          </Button>
          <Button variant="contained" onClick={() => navigate('/')}>
            Voltar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PaymentMethodEdit;