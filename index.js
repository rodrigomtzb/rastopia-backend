const { ApolloServer } = require("apollo-server");
//const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectDB = require("./config/db");
const jwt = require("jsonwebtoken");
const express = require('express');
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });

conectDB();


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //console.log(req.headers);

    const token = req.headers["authorization"] || "";

    if (token) {
      try {
        const user = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.SECRETA
        );
        
        return {
          user,
        };
      } catch (error) {
       console.log("error", error);
      }
    }
  },
});
/*
const app = express();
app.use(cors());
app.use(express.json({ extended: true }));
server.applyMiddleware({
 
  app,
});
app.use(express.static(path.join(__dirname, "/public/")));


app.get('/iniciar-sesion', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'iniciar-sesion.html'));
});
app.get('/crear-cuenta', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'crear-cuenta.html'));
});

app.get('/catalogo/mujer', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/catalogo/', 'mujer.html'));
});
app.get('/catalogo/hombre', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/catalogo/', 'hombre.html'));
});
app.get('/producto/*', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/producto/', '[id].html'));
});
app.get('/carrito', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'carrito.html'));
});
app.get('/checkout', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'checkout.html'));
});
app.get('/compra-realizada', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'compra-realizada.html'));
});
app.get('/nuevo-producto', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'nuevo-producto.html'));
});
app.get('/editar-producto/*', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/editar-producto/', '[id].html'));
});
app.get('/pedidos', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/', 'pedidos.html'));
});

app.get('/pedido/*', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/pedido/', '[id].html'));
});
app.get('/perfil/*', function(req, res){
  res.sendFile(path.resolve(__dirname + '/public/perfil/', '[id].html'));
});

app.use(function(req, res, next) {
  res.status(404);
  res.send('Esta página no existe');
});


app.listen({ port: 8080 }, () =>
console.log(`Server ready at  $ ${server.graphqlPath}`)
);
*/

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`servidor listo en la URL ${url}`);
});
