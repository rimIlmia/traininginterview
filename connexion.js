const mysql = require("mysql");
//connexion to bd
 connexion = mysql.createConnection({
  database: "traininginterviewdb",
  host: "localhost",
  user: "root",
  password: "password"
});
connexion.connect(function (err) {
    if (err) throw err;
    return err
});
module.exports = connexion;
