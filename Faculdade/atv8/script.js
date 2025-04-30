document.addEventListener('DOMContentLoaded', function() {
    const ratesBody = document.getElementById('ratesBody');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    // Função para carregar as cotações
    function loadCurrencyRates() {
        showLoading();
        
        // URL de exemplo - substitua por uma API real ou use os dados mockados
        const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados da API');
                }
                return response.json();
            })
            .then(data => {
                // Formata os dados da API
                const formattedRates = Object.entries(data.rates)
                    .map(([code, rate]) => ({
                        code,
                        rate,
                        date: new Date().toISOString().split('T')[0] // Data atual
                    }))
                    .slice(0, 8); // Limita a 8 moedas
                
                // Adiciona algumas datas antigas para demonstração
                formattedRates[3].date = '2023-09-15';
                formattedRates[5].date = '2023-10-01';
                
                displayRates(formattedRates);
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
                // Se a API falhar, usa dados mockados
                useMockData();
            })
            .finally(() => {
                hideLoading();
            });
    }

    function useMockData() {
        const mockData = [
            { code: 'USD', rate: 1.0, date: new Date().toISOString().split('T')[0] },
            { code: 'EUR', rate: 0.93, date: new Date().toISOString().split('T')[0] },
            { code: 'GBP', rate: 0.79, date: new Date().toISOString().split('T')[0] },
            { code: 'JPY', rate: 151.25, date: '2023-09-15' },
            { code: 'BRL', rate: 5.05, date: new Date().toISOString().split('T')[0] },
            { code: 'CAD', rate: 1.36, date: '2023-10-01' },
            { code: 'AUD', rate: 1.52, date: new Date().toISOString().split('T')[0] },
            { code: 'CNY', rate: 7.30, date: new Date().toISOString().split('T')[0] },
        ];
        
        displayRates(mockData);
    }

    function showLoading() {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        ratesBody.innerHTML = '';
    }

    function hideLoading() {
        loadingElement.style.display = 'none';
    }

    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function isOldRate(dateString) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const rateDate = new Date(dateString);
        return rateDate < oneWeekAgo;
    }

    function displayRates(rates) {
        ratesBody.innerHTML = '';
        
        rates.forEach(rate => {
            const row = document.createElement('tr');
            const isOld = isOldRate(rate.date);
            
            row.innerHTML = `
                <td class="${isOld ? 'outdated' : 'up-to-date'}">${rate.code}</td>
                <td class="${isOld ? 'outdated' : 'up-to-date'}">${rate.rate.toFixed(4)}</td>
                <td class="${isOld ? 'outdated' : 'up-to-date'}">${rate.date}</td>
            `;
            
            ratesBody.appendChild(row);
        });
    }

    // Carrega as cotações ao iniciar
    loadCurrencyRates();
});