//Imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtUtils = require("../utils/jwt.utils");
const connexion = require("../connexion");
// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{8,12}$/;
//Routes
module.exports = {
  /**************************inscription***************************** */
  register: function(req, res) {
    //params
    let firstName = req.body.firstName;
    firstName =
      firstName.charAt(0).toUpperCase() + firstName.substring(1).toLowerCase();

    let lastName = req.body.lastName;
    lastName =
      lastName.charAt(0).toUpperCase() + lastName.substring(1).toLowerCase();

    let password = req.body.password;
    let email = req.body.email;
    let urlPhoto = req.body.urlPhoto;
    console.log(
      "firstName: " +
        firstName +
        "   LastName" +
        lastName +
        "   pwd   " +
        password +
        "   email   " +
        email
    );

    if (
      email == null ||
      password == null ||
      firstName == null ||
      lastName == null ||
      urlPhoto == null
    ) {
      return res.json({ success: false, msg: "Champs obligatoires" });
    }
    if (firstName.length >= 13 || firstName.length <= 2) {
      console.log("First Name doit contenir entre 2-15 caractères");
      return res.json({
        success: false,
        msg: "First Name doit contenir entre 3-15 caractères"
      });
    }
    if (lastName.length >= 13 || lastName.length <= 2) {
      console.log("LastName doit contenir entre 2-15 caractères");
      return res.json({
        success: false,
        msg: "LastName doit contenir entre 2-15 caractères"
      });
    }
    if (!EMAIL_REGEX.test(email)) {
      console.log("email is not valid");
      return res.json({ success: false, msg: "email is not valid" });
    }
    if (!PASSWORD_REGEX.test(password)) {
      console.log(
        "password invalid (must length 8-12 and include 1 number at least)"
      );
      return res.json({
        success: false,
        msg: "password invalid (must length 8-12 and include 1 number at least)"
      });
    }

    let reqSql = "SELECT * FROM users WHERE email= " + "'" + email + "'";
    connexion.query(reqSql, function(err, existe) {
      if (err) {
        return res.json({ success: false, msg: "Erreur existing email" });
      } else {
        if (existe.length === 0) {
          bcrypt.hash(password, 5, (errH, passwordCrypte) => {
            if (errH) {
              console.log("Erreur de cryptage" + errH);
              res.json({ success: false, msg: "Erreur de cryptage" + errH });
            } else {
              let sqlInsert =
                "INSERT INTO users ( lastName, firstName,password, email, photoUrl) values(?,?,?,?,?)";
              connexion.query(
                sqlInsert,
                [lastName, firstName, passwordCrypte, email, urlPhoto],
                erro => {
                  if (erro) {
                    console.log("Erreur pendant l'insertion" + erro);
                    return res.json({
                      success: false,
                      msg: "Erreur pendant l'insertion" + erro
                    });
                  }
                  console.log("Enregistrer avec success");
                  return res.json({
                    success: true,
                    msg: "Enregistré avec success"
                  });
                }
              );
            }
          });
        } else {
          return res.json({
            success: false,
            msg: "Un compte a déjà été créé avec l’adresse " + email
          });
        }
      }
    });
  },
  /***************************Login************************************ */
  login: function(req, res) {
    //params
    let email = req.body.email;
    let password = req.body.password;

    console.log("email " + email + "  password   " + password);

    if (email == null || password == null) {
      console.log("Champs obligatoires");
      return res.json({ success: false, msg: "Champs obligatoires" });
      // res.json
    }
    if (!EMAIL_REGEX.test(email)) {
      console.log("email is not valid");
      return res.json({ success: false, msg: "email not valid" });
    }
    let reqSql = "SELECT * FROM users WHERE email= " + "'" + email + "'";
    connexion.query(reqSql, function(err, existe) {
      if (err) {
        console.log("Erreur existing email");
        return res.json({ success: false, msg: "Erreur existing email" + err });
      } else {
        if (existe.length === 0) {
          console.log("Email n'existe pas");
          return res.json({
            success: false,
            msg: "L'e-mail entré ne correspond à aucun compte!"
          });
        } else {
          bcrypt.compare(password, existe[0].password, function(err, success) {
            if (success) {
              return res.json({
                success: true,
                idUser: existe[0].idUser,
                token: jwtUtils.generateTokenForUser(existe[0]),
                msg: "identifiants valides"
              });
            } else {
              console.log("mot de passe incorrect");
              return res.json({
                success: false,
                msg: "Le mot de passe que vous avez rentré n'est pas correct!"
              });
            }
          });
        }
      }
    });
  },
  /*****************************Profil************************************* */
  profil: function(req, res) {
    var headerAuth = req.headers["authorization"];
    console.log(headerAuth);
    var idUser = jwtUtils.getUserId(headerAuth);
    console.log("id user " + idUser);
    if (idUser < 0) {
      return res.send({ success: false, msg: "l'utilisateur n'existe pas" });
    }
    let reqSql = "SELECT * FROM users WHERE idUser= " + "'" + idUser + "'";

    connexion.query(reqSql, function(err, users) {
      if (err) {
        return res.json({
          success: false,
          msg: "erreur recuperation info user" + err
        });
      } else {
        if (users.length === 0) {
          return res.json({ success: false, msg: "user n'existe pas" });
        } else {
          return res.json({ success: true, user: users[0] });
        }
      }
    });
  },
  test: function(req, res) {
    console.log("test");
    console.log(req.file);
    return res.json({ success: true });
  },
  info: function(req, res) {
    let id = req.param("id");
    console.log("id find : " + id);
    if (id == null) {
      return res.json({ success: false, msg: "Champs obligatoires" });
      // res.json
    }
    let sql1 = "SELECT * FROM users WHERE idUser= " + "'" + id + "'";
    connexion.query(sql1, (errors, result) => {
      if (errors) {
        res.json({ success: false, msg: errors });
      }
      res.send(result);
    });
  },
  /**********************update info user********** */
  updateProfil: function(req, res) {
    //params

    let id = req.body.idUser;
    let firstName = req.body.firstName;
    if (firstName !== null)
      firstName =
        firstName.charAt(0).toUpperCase() +
        firstName.substring(1).toLowerCase();
    let lastName = req.body.lastName;
    if (lastName !== null)
      lastName =
        lastName.charAt(0).toUpperCase() + lastName.substring(1).toLowerCase();

    let metier = req.body.metier;
    if (metier !== null)
      metier =
        metier.charAt(0).toUpperCase() + metier.substring(1).toLowerCase();

    let pays = req.body.pays;
    let ville = req.body.ville;
    if (ville !== null)
      ville = ville.charAt(0).toUpperCase() + ville.substring(1).toLowerCase();

    let linkedin = req.body.linkedin;
    let facebook = req.body.facebook;
    let description = req.body.description;
    if (description !== null)
      description =
        description.charAt(0).toUpperCase() +
        description.substring(1).toLowerCase();

    let reqSql =
      "UPDATE   users SET firstName = '" +
      firstName +
      "', lastName= '" +
      lastName +
      "',metier = '" +
      metier +
      "',pays ='" +
      pays +
      "',ville = '" +
      ville +
      "', linkedin = '" +
      linkedin +
      "',facebook ='" +
      facebook +
      "', description ='" +
      description +
      "' WHERE idUser='" +
      id +
      "'";
    console.log(reqSql);
    connexion.query(reqSql, function(err, result) {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        if (req.body.urlPhoto) {
          let sql =
            "UPDATE users SET photoUrl ='" +
            req.body.urlPhoto +
            "' WHERE idUser='" +
            id +
            "'";
          connexion.query(sql, (error, reslt) => {
            if (error) {
              return res.json({ success: false, msg: error });
            }
          });
        }
        console.log("update  ok");
        return res.json({ success: true, msg: "update success" });
      }
    });
  },
  /*****************Get Photo******/
  getPhoto: function(req, res) {
    const { fileid } = req.params;

    return res.sendFile(__dirname + "/uploads/photos/" + fileid);
  },
  /**Get user video */
  getUserVideo: function(req, res) {
    const { idVideo } = req.params;
    let sql1 = "SELECT idUser FROM Videos WHERE idVideo = " + idVideo + "";
    connexion.query(sql1, (errors, result) => {
      if (errors) {
        return res.json({ success: false, msg: errors });
      }
      let idUser = result[0].idUser;
      let sql2 = "SELECT * FROM users WHERE idUser = " + idUser;
      connexion.query(sql2, (err, rslt) => {
        if (err) {
          return res.json({ success: false, msg: err });
        }
        return res.json(rslt);
      });
    });
  }
};
