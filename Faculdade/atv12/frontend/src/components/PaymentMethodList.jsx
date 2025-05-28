import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Typography, Button 
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

const PaymentMethodList = () => {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const response = await axios.get('http://localhost:3001/api/payment-methods');
    setMethods(response.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este método de pagamento?')) {
      await axios.delete(`http://localhost:3001/api/payment-methods/${id}`);
      fetchMethods();
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Meios de Pagamento
      </Typography>
      
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
            {methods.map((method) => (
              <TableRow key={method.id}>
                <TableCell>{method.name}</TableCell>
                <TableCell>{method.maxValue}</TableCell>
                <TableCell>{method.type}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/detail/${method.id}`}>
                    <Visibility />
                  </IconButton>
                  <IconButton component={Link} to={`/edit/${method.id}`}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(method.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/create"
        style={{ marginTop: '20px' }}
      >
        Adicionar Novo
      </Button>
    </div>
  );
};

export default PaymentMethodList;