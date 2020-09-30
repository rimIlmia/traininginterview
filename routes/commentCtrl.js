//Imports
const connexion = require("../connexion");
module.exports = {
  // create commment
  addComment: (req, res) => {
    let content = req.body.comment;
    let users_idUser = req.body.idUser;
    let videos_idVideo = req.body.idVideo;
    let sqlInsert =
      "INSERT INTO commentaires (content, date, videos_idVideo, users_idUser) values(?,?,?,?)";
    connexion.query(
      sqlInsert,
      [content, new Date(), videos_idVideo, users_idUser],
      erro => {
        if (erro) {
          return res.status(erro.statusCode).send(erro);
        }
        return res.status(200).json({
          success: true,
          msg: "Enregistré avec success"
        });
      }
    );
  },
  //comments for video (les commentaires d'une vidéo)
  commentsVideo: (req, res) => {
    let videos_idVideo = req.param("idVideo");
    console.log(videos_idVideo);
    let sql =
      "SELECT * FROM commentaires inner join users on users.idUser = commentaires.users_idUser WHERE commentaires.videos_idVideo='" +
      videos_idVideo +
      "' ORDER BY date DESC";
    console.log(sql);
    connexion.query(sql, (errors, result) => {
      if (errors) {
        return res.status(errors.statusCode).send(errors);
      }
      return res.status(200).json(result);
    });
  },
  //Delete comment
  deleteByIdComment: (req, res) => {
    sql1 = "DELETE FROM commentaires WHERE idCommentaire = " + req.body.id;
    console.log(sql1);
    connexion.query(sql1, (errors, result) => {
      if (errornops) {
        return res.status(errors.statusCode).send(errors);
      }
      return res.status(200).send({ msg: "supprimé" });
    });
  }
};
