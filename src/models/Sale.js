
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SequelizePaginate = require('sequelize-paginate'); // Importe o sequelize-paginate


const Sale = sequelize.define('Sale', {
  sale: {
    type: DataTypes.JSONB, // Use JSONB para armazenar dados complexos, como produtos
    allowNull: false,
  },
  descount: {
    type: DataTypes.FLOAT,
  },
  total: {
    type: DataTypes.FLOAT,
  },
  createdAt: {
    field: 'createdat',
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    field: 'updatedat',
    type: DataTypes.DATE,
  },
});


// Adicione a capacidade de paginação ao modelo
SequelizePaginate.paginate(Sale);

module.exports = Sale;
