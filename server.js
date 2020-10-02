//Imports
const express = require("express");
const bodyParser = require("body-parser"); 
const apiRouter = require("./apiRouter").router;
const cors = require("cors");

//Instantiate server
const server = express();
//port
const port = 7000;
//body-parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
// access to api
server.use(cors());

//Routes
server.use("/api/",apiRouter);
//Launch server
server.listen(port, res => {
  console.log("Serveur fonctionne sur le port " + port);
  console.log("test");
});
