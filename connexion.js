const mysql = require("mysql2");
//connexion to bd
 connexion = mysql.createConnection({
  database: "traininginterviewdb",
  host: "localhost",
  user: "rim",
  password: "Password@123"
});
connexion.connect(function (err) {
    if (err) throw err;
    return err
});
module.exports = connexion;
