// const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// UserSchema.pre("save", async function (next) {
//   // criptografa a senha antes de salvar no bd
//   if (!this.isModified("password")) {
//     // se pass não foi modificado
//     return next();
//   }

//   this.password = await bcrypt.hash(this.password, 4);
// });

// // cria um method comparar a senha informada pelo usuario com a senha cryptografada do bd
// UserSchema.methods = {
//   compareHash(password) {
//     return bcrypt.compare(password, this.password);
//   },
// };

// UserSchema.plugin(mongoosePaginate);
// module.exports = mongoose.model("User", UserSchema);


const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
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
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 4);
      }
    },
  },
});

User.prototype.compareHash = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
