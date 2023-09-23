# Passport
https://www.passportjs.org/

## Local authentication

```typescript
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');


passport.use(new LocalStrategy(async (username, password, callback) => {
    const userData = await db.get(`select * from users where username == ${username}`);
    if (!userData) return callback(error);

    crypto.pdkdf2(password, userData.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return callback(err);
        if (!crypto.timingSafeEqual(userData.hashedPassword, hashedPassword)) return callback(null, false, {mesage: 'Incorrect username or password'});
        return callback(null, userData);
    });
}));

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
```

## Google



# Stripe