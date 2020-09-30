//Imports
const connexion = require("../connexion");
const fs = require("fs");
module.exports = {
  // create publication
  upload: function(req, res) {
    let titreVideo = req.body.titreVideo;
    let nomVideo = req.body.nomVideo;
    let idUser = req.body.idUser;
    let extension = req.body.extension;
    if (
      titreVideo == null ||
      nomVideo == null ||
      idUser == null ||
      extension == null
    ) {
      return res.json({ success: false, msg: "Champs obligatoires" });
    }
    let sqlInsert =
      "INSERT INTO videos (titreVideo, nomVideo, extension, idUser,date) values(?,?,?,?,?)";
    connexion.query(
      sqlInsert,
      [titreVideo, nomVideo, extension, idUser, new Date()],
      erro => {
        if (erro) {
          return res.json({
            success: false,
            msg: "Erreur pendant l'insertion" + erro
          });
        }
        return res.json({
          success: true,
          msg: "Enregistré avec success"
        });
      }
    );
  },
  // Get video list by id
  videosListById: function(req, res) {
    let id = req.param("id");
    if (id == null) {
      return res.json({ success: false, msg: "Champs obligatoires" });
    }
    let sql1 =
      "SELECT * FROM videos inner join users on users.idUser = videos.idUser  WHERE videos.idUser= " +
      "'" +
      id +
      "' ORDER BY date DESC";
    connexion.query(sql1, (errors, result) => {
      if (errors) {
        res.json({ success: false, msg: errors });
      }
      res.send(result);
    });
  },
  // get video

  getVideo: function(req, res) {
    const { fileid } = req.params;

    return res.sendFile(__dirname + "/uploads/videos/" + fileid);
  },
  // delete publication

  deletePubById: function(req, res) {
    const { idVideo } = req.params;
    console.log("ici");
    sql1 = "DELETE FROM commentaires WHERE videos_idVideo = " + idVideo;

    connexion.query(sql1, (errors, result) => {
      if (errors) {
        return res.status(errors.statusCode).send(errors);
      }
      let sql2 = "DELETE FROM videos WHERE idVideo = " + idVideo;

      connexion.query(sql2, (err, re) => {
        if (err) {
          return res.status(err.statusCode).send(err);
        }
        res.status(200).json({ success: true, msg: "video supprimé" });
      });
    });
  },
  // Delete video (file)
  deletefile: function(req, res) {
    const { nameFile } = req.params;
    fs.unlink(__dirname + "/uploads/videos/" + nameFile, function(err) {
      if (err) return res.json({ success: false, msg: err });
      console.log("File deleted!");
      return res.json({ success: true });
    });
  },
  // Get all publication
  allPublication: function(req, res) {
    let sql =
      "SELECT * FROM videos inner join users on users.idUser = videos.idUser ORDER BY date DESC";
    connexion.query(sql, (errors, result) => {
      if (errors) {
        return res.json({ success: false, msg: errors });
      }
      res.send(result);
    });
  }
};
