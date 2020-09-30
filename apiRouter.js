//Imports
const express = require("express");
const path = require("path");
const cors = require("cors");
const usersCtrl = require("./routes/usersCtrl");
const publicationCtrl = require("./routes/publicationCtrl");
const commentCtrl = require("./routes/commentCtrl");
const connexion = require("./connexion");
const multer = require("multer");
const apiRouter = express.Router();
const uploadDir = path.join(__dirname, "routes/uploads/photos");

apiRouter.use(cors({ credentials: true, origin: "http://localhost:4200" }));
apiRouter.use(express.static(uploadDir));
// Storage for videos
const storage = multer.diskStorage({
  destination: "routes/uploads/videos",
  filename: (req, file, cb) => {
    cb(null, "video" + Date.now() + "." + file.mimetype.split("/")[1]);
  }
});
//storage for photo
const storagePhoto = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, "photo" + Date.now() + "." + file.mimetype.split("/")[1]);
  }
});
const upload = multer({ storage: storage });
const uploadPhoto = multer({ storage: storagePhoto });

//Router
exports.router = (function() {
  //users Routes
  apiRouter.route("/user/register/").post(usersCtrl.register);
  apiRouter.route("/user/login/").post(usersCtrl.login);
  apiRouter.route("/user/me/").get(usersCtrl.profil);
  apiRouter.route("/user/id/").get(usersCtrl.info);
  apiRouter.route("/user/photo/:fileid").get(usersCtrl.getPhoto);
  apiRouter.route("/user/updateProfile/").post(usersCtrl.updateProfil);
  apiRouter.route("/user/:idVideo/").get(usersCtrl.getUserVideo);
  apiRouter.post("/user/upload/", upload.single("myFile"), (req, res) => {
  res.json({
      filename: req.file.filename,
      file: req.file,
      path: req.file.path
    });
  });
  apiRouter.post(
    "/user/upload/photo",
    uploadPhoto.single("myFile"),
    (req, res) => {
      console.log(req.file.filename);
      res.json({
        filename: req.file.filename,
        file: req.file,
        path: req.file.path
      });
    }
  );
  //Publication Routes
  apiRouter.route("/publication/add").post(publicationCtrl.upload);
  apiRouter.route("/publication/id/").get(publicationCtrl.videosListById);
  apiRouter.route("/user/video/:fileid").get(publicationCtrl.getVideo);
  apiRouter
    .route("/publication/delete/:idVideo/")
    .delete(publicationCtrl.deletePubById);
  apiRouter
    .route("/publication/deletefile/:nameFile/")
    .delete(publicationCtrl.deletefile);
  apiRouter.route("/publication/all/").get(publicationCtrl.allPublication);
  //comments Routes
  apiRouter.route("/comment/add").post(commentCtrl.addComment);
  apiRouter.route("/comment/:idVideo").get(commentCtrl.commentsVideo);
  apiRouter
    .route("/comment/delete")
    .delete(commentCtrl.deleteByIdComment);

  return apiRouter;
})();
