var session = require("express-session");
const FileStore = require("session-file-store")(session);

module.exports = session({
  name: "session-id",
  secret: "123456-7890-09876-54321",
  saveUninitialized: false,
  resave: false,
  store: new FileStore(),
});
