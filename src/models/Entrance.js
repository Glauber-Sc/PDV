// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");

// const EntranceSchema = new mongoose.Schema({
//   sale: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Sale",
//   },

//   value: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// EntranceSchema.plugin(mongoosePaginate);
// module.exports = mongoose.model("Entrance", EntranceSchema);


const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SequelizePaginate = require('sequelize-paginate'); // Importe o sequelize-paginate

const Entrance = sequelize.define('Entrance', {
  saleId: {
    field: "saleid",
    type: DataTypes.INTEGER,
    references: {
      model: 'Sales',
      key: 'id',
    },
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
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
SequelizePaginate.paginate(Entrance);

module.exports = Entrance;
