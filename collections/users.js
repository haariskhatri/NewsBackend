
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
  },

});


const UserAddress = new mongoose.model('users', userSchema);

module.exports = UserAddress;



