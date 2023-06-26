const fs = require("fs");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const accounts = require("./accounts.json");


function authenticateUser(username, password, done) {
    if (accounts[username] === undefined) {
        return done(null, false, { message: "No user with that username" });
    }
    else if (accounts[username] !== password) {
        return done(null, false, { message: "Wrong password" });
    }
    else {
        user = {};
        user.username = username;
        user.password = password;
        return done(null, user);
    }
}

function checkAuthencticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.redirect("/login");
    }
}

function checkNotAuthencticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    else {
        return next();
    }
}


const app = express();


passport.use(new LocalStrategy(authenticateUser));
passport.serializeUser((user, done) => done(null, user.username));
passport.deserializeUser((username, done) => { 
    return done(null, {username: username, password: accounts[username]});
 });


app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "some-random-text",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.get("/register", checkNotAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/register.html");
});

app.post("/register", checkNotAuthencticated, (req, res) => {
    if (accounts[req.body.username] !== undefined) {
        res.redirect("/register");
        return;
    }
    accounts[req.body.username] = req.body.password;
    fs.writeFile("accounts.json", JSON.stringify(accounts), () => {});
    res.redirect("/login");
});

app.get("/login", checkNotAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/login.html");
});

app.post("/login", checkNotAuthencticated, passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: false
}));

app.get("/logout", checkAuthencticated, (req, res) => {
    req.logOut( (err) => {  } );
    res.redirect("/login");
});

app.get("/profile", checkAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/profile.html");
});


app.listen(3000);
