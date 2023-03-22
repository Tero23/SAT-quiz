const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const { googleUser: GoogleUser } = require("../models/index");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const catchAsync = require("../utils/catchAsync");
const { v4 } = require("uuid");

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ["email", "profile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      try {
        const user = await GoogleUser.findOne({
          where: { googleId: profile.id },
        });
        if (user) return done(null, user);

        const newUser = await GoogleUser.create({
          googleId: profile.id,
          username: profile.displayName,
        });
        return done(null, newUser);
      } catch (err) {
        console.log(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromBodyField("jwt"),
  secretOrKey: process.env.SESSION_SECRET,
};

// Set up the JWT strategy
passport.use(
  new JwtStrategy(
    opts,
    catchAsync(async (jwtPayload, done) => {
      // Find the user in the database using the ID from the JWT payload
      const user = await GoogleUser.findOne({
        where: { googleId: jwtPayload.id },
      });
      if (user) return done(null, user);
      // If the user is not found, return false
      return done(null, false);
    })
  )
);
