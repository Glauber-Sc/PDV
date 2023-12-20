// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");

// const ProductSoldSchema = new mongoose.Schema({
//   products: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       amount: Number,
//       value: Number,
//     },
//   ],
//   totalValue: {
//     type: Number,
//     required: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// ProductSoldSchema.plugin(mongoosePaginate);
// module.exports = mongoose.model("ProductSold", ProductSoldSchema);


const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ProductSold = sequelize.define('ProductSold', {
  products: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  totalValue: {
    type: DataTypes.FLOAT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ProductSold;
