const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Modelo Meio de Pagamento
const PaymentMethod = sequelize.define('PaymentMethod', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('eletrônico', 'físico'),
    allowNull: false
  }
});

// Rotas
app.get('/api/payment-methods', async (req, res) => {
  const methods = await PaymentMethod.findAll();
  res.json(methods);
});

app.get('/api/payment-methods/:id', async (req, res) => {
  const method = await PaymentMethod.findByPk(req.params.id);
  if (method) {
    res.json(method);
  } else {
    res.status(404).send('Método de pagamento não encontrado');
  }
});

app.post('/api/payment-methods', async (req, res) => {
  try {
    const method = await PaymentMethod.create(req.body);
    res.status(201).json(method);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/payment-methods/:id', async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (method) {
      await method.update(req.body);
      res.json(method);
    } else {
      res.status(404).send('Método de pagamento não encontrado');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/payment-methods/:id', async (req, res) => {
  const method = await PaymentMethod.findByPk(req.params.id);
  if (method) {
    await method.destroy();
    res.status(204).send();
  } else {
    res.status(404).send('Método de pagamento não encontrado');
  }
});

// Inicialização do servidor
(async () => {
  await sequelize.sync();
  app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
  });
})();