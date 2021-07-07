const Client = require("../models/Client");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcryptjs = require("bcryptjs");
const { createToken } = require("../utils/");
require("dotenv").config({ path: "variables.env" });

var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resolvers = {
  Query: {
    getAuth: async (_, {}, ctx) => {
      return ctx.user;
    },
    getClient: async (_, { id }) => {
      const client = await Client.findById(id);
      if (!client) {
        throw new Error("El usuario no existe");
      }
      return client;
    },
    getProducts: async () => {
      const products = await Product.find({});
      return products;
    },
    getProductsFilter: async (_, { input }) => {
      let filter = {};

      const keys = Object.keys(input);

      for (const key of keys) {
        if (input[key] !== "") {
          if (key === "genre" || key === "category") {
            filter[key] = input[key];
          }
          if (key === "price") {
            filter[key] = { $lte: input[key] };
          }
          if (key === "sizes") {
            filter["sizes.size"] = {
              $in: input.sizes.map((item) => item.size),
            };
          }
        }
      }

      // {genre, category,  price:  'sizes.size': {$in:  sizes.map(item => item.size ) }  }

      const products = await Product.find(filter)
        .sort({
          registry: -1,
        })
        .limit(input.limit)
        .skip(input.skip);

      return products;
    },
    getProduct: async (_, { id }) => {
      const product = await Product.findById(id);

      if (!product) {
        throw new Error("El producto no existe");
      }

      return product;
    },
    getOrders: async (_, {}, ctx) => {
      if (ctx.user.role !== "admin") {
        throw new Error("No puedes ver los pedidos");
      }

      const orders = await Order.find({}).populate("client");
      return orders;
    },
    getOrdersByClient: async (_, { id }, ctx) => {
      if (!ctx.user) {
        throw new Error("No puedes ver los pedidos");
      }

      const clientID = id ? id : ctx.user.id;

      const orders = await Order.find({ client: clientID }).populate("client");
      return orders;
    },
    getOrder: async (_, { id }, ctx) => {
      if (ctx.user.role !== "admin") {
        throw new Error("No puedes ver el pedido");
      }

      const order = await Order.findById(id).populate("client");

      if (!order) {
        throw new Error("No existe, este pedido");
      }
      return order;
    },
  },
  Mutation: {
    //client

    newClient: async (_, { input }) => {
      const { email, password } = input;
      const clientExists = await Client.findOne({ email });

      if (clientExists) {
        throw new Error("El usuario ya existe");
      }
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);

      try {
        const client = new Client(input);
        client.save();
        return client;
      } catch (error) {
        console.log("error", error);
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;
      const clientExists = await Client.findOne({ email });

      if (!clientExists) {
        throw new Error("El usuario no existe");
      }
      const passwordCorrect = await bcryptjs.compare(
        password,
        clientExists.password
      );

      if (!passwordCorrect) {
        throw new Error("El password es incorrecto");
      }

      return {
        token: createToken(clientExists, process.env.SECRETA, "24H"),
      };
    },
    updateClient: async (_, { id, input }, ctx) => {
      let client = await Client.findById(id);

      if (!client) {
        throw new Error("El usuario no existe");
      }

      client = await Client.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return client;
    },

    //product
    newProduct: async (_, { input }, ctx) => {
      if (ctx.user.role !== "admin") {
        throw new Error("No puedes subir productos");
      }
      const product = await Product(input);
      const result = await product.save();

      return result;
    },
    editProduct: async (_, { id, input }, ctx) => {
      let product = await Product.findById(id);

      if (!product) {
        throw new Error("El producto no existe");
      }

      if (ctx.user.role !== "admin") {
        throw new Error("No puedes actualizar productos");
      }
      product = await Product.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return product;
    },
    deleteProduct: async (_, { id }, ctx) => {
      let product = await Product.findById(id);

      if (!product) {
        throw new Error("El producto no existe");
      }

      if (!ctx.user && ctx.user.role !== "admin") {
        throw new Error("No puedes actualizar productos");
      }
      console.log(product)
      product = await Product.findOneAndDelete({ _id: id });

      return "Producto eliminado";
    },
    //Create order

    newOrder: async (_, { input }, ctx) => {
      const { order } = input;

      let total = 0;

      if (!ctx.user) {
        throw new Error("No puedes dar de alta un pedido");
      }

      for await (const item of order) {
        const { id } = item;
        const product = await Product.findById(id);

        if (item.quantity > product.quantity) {
          throw new Error(
            `Por el momento solo contamos con ${product.quantity} piezas en stock del articulo ${item.name}. Por favor modifica tu compra`
          );
        } else {
          product.quantity = product.quantity - item.quantity;
          if (product.quantity === 0) {
            await product.save();
            //await product.findOneAndDelete({ _id: id });
          } else {
            await product.save();
          }

          total = total + item.quantity * item.price;
        }
      }

      input.total = total + 80;
      //considerar un coso
      const orderComplete = await new Order(input);
      await orderComplete.save();
      console.log(orderComplete);
      return orderComplete;
    },
    editOrder: async (_, { id, input }, ctx) => {
      if (ctx.user.role !== "admin") {
        throw new Error("No puedes editar un pedido");
      }

      console.log(id, input, "id e input");

      let order = await Order.findById(id);

      if (!order) {
        throw new Error("No existe el pedido que quieres editar");
      }
      order = await Order.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });

      return order;
    },

    deleteOrder: async (_, { id, input }, ctx) => {
      if (ctx.user.role !== "admin") {
        throw new Error("No puedes eliminar un pedido");
      }

      let order = await Order.findById(id);
      if (!order) {
        throw new Error("No existe el pedido que quieres eliminar");
      }

      order = await Order.findOneAndDelete({ _id: id });

      return "Pedido eliminado";
    },

    uploadImage: async (_, { file, uploadOptions }) => {
      let result;
      try {
        result = await cloudinary.uploader.upload(file, uploadOptions);
      } catch (error) {
        return `La imagen no puede ser guardada: ${error.message}`;
      }

      return result;
    },
  },
};

module.exports = resolvers;
