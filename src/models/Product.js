

// const { DataTypes } = require('sequelize');
// const sequelize = require('../sequelize');

// const SequelizePaginate = require('sequelize-paginate');

// const Product = sequelize.define('Product', {
//   barcode: {
//     type: DataTypes.STRING,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   amount: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   salePrice: {
//     field: 'saleprice',
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   expirationDate: {
//     field: 'expirationdate',
//     type: DataTypes.DATE,
//   },
//   createdAt: {
//     field: 'createdat',
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     field: 'updatedat',
//     type: DataTypes.DATE,
//   },
// });

// // Adicione a capacidade de paginação ao modelo
// SequelizePaginate.paginate(Product)

// module.exports = Product;





const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SequelizePaginate = require('sequelize-paginate');

const Product = sequelize.define('Product', {
  barcode: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  salePrice: {
    field: 'saleprice',
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expirationDate: {
    field: 'expirationdate',
    type: DataTypes.DATE,
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
SequelizePaginate.paginate(Product)

module.exports = Product;
