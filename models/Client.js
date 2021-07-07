const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  lastname: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  address: {
    type: String,
    require: false,
    default: "742 Evergreen Terrace"
  },
  phone: {
    type: String,
    require: false,
    default: "5547490390",
  },
  orders: {
    type: Array,
    require: false,
  },
  discount: {
    type: String,
    default: 20,
  },
  role: {
    type: String,
    default: "client",
  },
  creditCard: {
    type: String,
    require: false,
    default: "8998657834569898",
  },
  acceptTerms: {
    type:Boolean,
    default:false
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Client", ClientSchema);
