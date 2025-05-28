import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentMethodList from './components/PaymentMethodList';
import PaymentMethodDetail from './components/PaymentMethodDetail';
import PaymentMethodCreate from './components/PaymentMethodCreate';
import PaymentMethodEdit from './components/PaymentMethodEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentMethodList />} />
        <Route path="/create" element={<PaymentMethodCreate />} />
        <Route path="/detail/:id" element={<PaymentMethodDetail />} />
        <Route path="/edit/:id" element={<PaymentMethodEdit />} />
      </Routes>
    </Router>
  );
}

export default App;