var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var strategy = new Auth0Strategy({
    domain: 'emposoft.auth0.com',
    clientID: 'e6RroHpjwIETB0wgw9DrW7r8wN05139S',
    clientSecret: 'LEaNa0CMkpGc8KqhUlHHf-9FtFRKAMTiMA0_N3Ug6uVPyA5Xv5izwfFx25wanFeC',
    callbackURL: '/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
});
passport.use(strategy);
// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
module.exports = strategy;