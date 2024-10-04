var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");
var JwtStrategy = require("passport-jwt").Strategy; // Đảm bảo tên biến đúng
var ExtractJwt = require("passport-jwt").ExtractJwt; // Dùng để trích xuất jwt từ request
var jwt = require("jsonwebtoken"); // Dùng để tạo, xác thực token

var config = require("../configs/config");
require("dotenv").config(); // Load biến môi trường từ file .env

// Xác thực Local
passport.use(new LocalStrategy(User.authenticate())); // Tác dụng: xác thực user, password
passport.serializeUser(User.serializeUser()); // Tác dụng: mã hóa user
passport.deserializeUser(User.deserializeUser()); // Tác dụng: giải mã user

// Tạo token
exports.getToken = function (user) {
  console.log("Creating token for user: ", user); // Log thông tin người dùng
  return jwt.sign(user, config.secretKey, { expiresIn: 86400 }); // Tạo token
};

// Cấu hình JWT
var opts = {}; // Options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Trích xuất jwt từ request
opts.secretOrKey = config.secretKey; // Secret key
console.log("JWT Secret Key:", opts.secretOrKey); // Thêm dòng này để kiểm tra

// Sử dụng JWT
exports.jwtPassport = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT Payload: ", jwt_payload); // Log payload JWT

    try {
      const user = await User.findOne({ _id: jwt_payload._id }); // Tìm user trong database
      if (user) {
        console.log("User found: ", user); // Log thông tin user
        return done(null, user); // Nếu tìm thấy user
      } else {
        console.log("User not found"); // Log nếu không tìm thấy user
        return done(null, false); // Nếu không tìm thấy user
      }
    } catch (err) {
      console.error("Error fetching user: ", err); // Log lỗi nếu có
      return done(err, false);
    }
  })
);

// Xác thực user
exports.verifyUser = passport.authenticate("jwt", { session: false }); // Xác thực user

// Xác thực admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  } else {
    const err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

// Google OAuth Strategy
var GoogleStrategy = require("passport-google-oauth2").Strategy;

exports.googlePassport = passport.use(
  new GoogleStrategy(
    {
      clientID: config.web.client_id,
      clientSecret: config.web.client_secret,
      callbackURL: config.web.redirect_uris,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      console.log("Google Profile: ", profile); // Log thông tin profile Google
      User.findOne({ googleId: profile.id })
        .then((user) => {
          if (user) {
            console.log("Google user found: ", user); // Log nếu tìm thấy user
            return done(null, user);
          } else {
            // Nếu không tìm thấy user, tạo mới
            user = new User({ username: profile.displayName });
            user.googleId = profile.id;
            user.fullname = profile.displayName;
            user.email = profile.emails[0].value;
            user.save().then((user) => {
              console.log("New Google user created: ", user); // Log thông tin user mới
              return done(null, user);
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching Google user: ", err); // Log lỗi nếu có
          return done(err, false);
        });
    }
  )
);
