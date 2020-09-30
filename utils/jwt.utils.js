const jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET = "aa8cdiszamcvbtt59sxsq77xa0aaptppeml25acvkwg6yoin";
module.exports = {
  generateTokenForUser: function(userData) {

    return jwt.sign(
        { idUser: userData.idUser /*, isAdmin:userData.isAdmin*/ },
      JWT_SIGN_SECRET,
      { expiresIn: "1h" }
    );
  },
  parseAuthorization: function(authorization) {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  getUserId: function(authorization) {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    console.log("LE token!" + token);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        console.log("++++++++");
        console.log(jwtToken);
          if (jwtToken != null) userId = jwtToken.idUser;
          console.log(jwtToken.idUser
            )
      } catch (err) {}
    }
    return userId;
  }
};
