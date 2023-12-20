// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");

// const ExitSchema = new mongoose.Schema({
//   descriptionExit: String,

//   value: {
//     type: Number,
//     required: true,
//   },

//   date: {
//     type: Date,
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// ExitSchema.plugin(mongoosePaginate);
// module.exports = mongoose.model("Exit", ExitSchema);



const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const  SequelizePaginate  = require('sequelize-paginate');

const Exit = sequelize.define('Exit', {
  descriptionExit: {
    field: 'descriptionexit',
    type: DataTypes.STRING,
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
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

SequelizePaginate.paginate(Exit)

module.exports = Exit;
