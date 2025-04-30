import React, { useState, useEffect } from 'react';

const CurrencyRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // URL fictícia
        const response = await fetch('https://api.example.com/currency-rates');
        if (!response.ok) {
          throw new Error('Falha ao carregar dados');
        }
        const data = await response.json();
        setRates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Dados mockados para exemplo
    const mockData = [
      { code: 'USD', rate: 1.0, date: '2023-10-20' },
      { code: 'EUR', rate: 0.85, date: '2023-10-19' },
      { code: 'GBP', rate: 0.73, date: '2023-10-18' },
      { code: 'JPY', rate: 110.25, date: '2023-10-01' },
      { code: 'BRL', rate: 5.45, date: '2023-09-15' }
    ];
    setRates(mockData);
    setLoading(false);
    
    // Descomente para usar a API real
    // fetchData();
  }, []);

  const isOldRate = (dateString) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const rateDate = new Date(dateString);
    return rateDate < oneWeekAgo;
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/2541/2541979.png" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
        <h1 style={{ margin: 0 }}>Cotações de Moedas</h1>
        <img src="https://cdn-icons-png.flaticon.com/512/2541/2541979.png" alt="Logo" style={{ width: '40px', height: '40px', marginLeft: '10px' }} />
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Código</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cotação</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate, index) => {
              const isOld = isOldRate(rate.date);
              return (
                <tr key={index}>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    color: isOld ? 'red' : 'green'
                  }}>
                    {rate.code}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    color: isOld ? 'red' : 'green'
                  }}>
                    {rate.rate.toFixed(2)}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    color: isOld ? 'red' : 'green'
                  }}>
                    {rate.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CurrencyRates;