const moongose = require("mongoose");

const ProductSchema = moongose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  model: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  quantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  discount: {
    type: Number,
    require: false,
  },
  sizes: {
    type: Array,
    require: false,
  },
  category: {
    type: String,
    require: true,
  },
  genre: {
    type: String,
    require: true,
  },
  photos: {
    type: Array,
    require: false,
  },
  created: {
    type: Date,
    default: Date.now(),
  }
});



module.exports = moongose.model("Product", ProductSchema);
