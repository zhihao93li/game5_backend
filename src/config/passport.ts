import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../models/User';
import AuthService from '../services/authService';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 环境变量未设置');
}

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const { user } = await AuthService.login(email, password);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
));

// passport.use(new GoogleStrategy(
//   {
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: '/auth/google/callback',
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const { user } = await AuthService.googleLogin(profile.id);
//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   }
// ));

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID!,
//   clientSecret: process.env.FACEBOOK_APP_SECRET!,
//   callbackURL: "/auth/facebook/callback",
//   profileFields: ['id', 'emails', 'name']
// },

// async (accessToken, refreshToken, profile, done) => {
//   try {
//     const { user } = await AuthService.facebookLogin(profile);
//     return done(null, user);
//   } catch (error) {
//     return done(error);
//   }
// }));

// passport.use(new TwitterStrategy({
//   consumerKey: process.env.TWITTER_CONSUMER_KEY!,
//   consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
//   callbackURL: "/auth/twitter/callback"
// },

// async (token, tokenSecret, profile, done) => {
//   try {
//     const { user } = await AuthService.twitterLogin(profile);
//     return done(null, user);
//   } catch (error) {
//     return done(error);
//   }
// }

export default passport;
