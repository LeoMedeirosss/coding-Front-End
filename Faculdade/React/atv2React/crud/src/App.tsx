import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import { PaymentMethodList } from './components/PaymentMethodList';
import { PaymentMethodView } from './components/PaymentMethodView';
import { PaymentMethodEdit } from './components/PaymentMethodEdit';
import { PaymentMethodCreate } from './components/PaymentMethodCreate';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container>
        <Routes>
          <Route path="/" element={<PaymentMethodList />} />
          <Route path="/view/:id" element={<PaymentMethodView />} />
          <Route path="/edit/:id" element={<PaymentMethodEdit />} />
          <Route path="/create" element={<PaymentMethodCreate />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
