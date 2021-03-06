const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");
const passport = require("passport");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Invalid User" });
      }
      try {
        if (user.password === password) {
          return done(null, user);
        }
        return done(null, false, { message: "Wrong Password" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
  return done(null, User.findOne({ _id: id }));
});
