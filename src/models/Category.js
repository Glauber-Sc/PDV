// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");

// const CategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// CategorySchema.plugin(mongoosePaginate);
// module.exports = mongoose.model("Category", CategorySchema);



const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Category;
