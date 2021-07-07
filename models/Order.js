const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  order: {
    type: Array,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Client",
  },
  status: {
    type: String,
    default: "PENDIENTE",
  },
  delivery: {
    type: Date,
    default: () => new Date(+new Date() + 2*24*60*60*1000)
  },
  shipment:{
    type:Number,
    default:80
  },
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("Order", OrderSchema);
