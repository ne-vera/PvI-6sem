const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const accounts = require("./accounts.json");

const jwtKey = "some_random_text";
const jwtExpirySeconds = 600;

function signIn(req, res) {
    const {username, password} = req.body;
    if (!username || !password || accounts[username] !== password) {
        return res.redirect("/login");
    }

    const token = jwt.sign({ username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds
	});
	console.log("token: ", token);

    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    return res.redirect("/profile");
}

function welcome(req, res) {
	const token = req.cookies.token;
	if (!token) {
        return res.redirect("/login");
	}

	var payload;
	try {
		payload = jwt.verify(token, jwtKey);
	} catch (err) {
        return res.redirect("/login");
	}

    res.sendFile(__dirname + "/html/profile.html");
}

function refresh(req, res) {
	const token = req.cookies.token;
	if (!token) {
        return res.redirect("/login");
	}

	var payload;
	try {
		payload = jwt.verify(token, jwtKey);
	} catch (err) {
        return res.redirect("/login");
	}

	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued 
    // if the old token is within 30 seconds of expiry.
	const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
	if (payload.exp - nowUnixSeconds > 30) {
        return res.redirect("/profile");
	}

	// Now, create a new token for the current user, with a renewed expiration time
	const newToken = jwt.sign({ username: payload.username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds
	});
    console.log("refresh: ", newToken);

	res.cookie("token", newToken, { maxAge: jwtExpirySeconds * 1000 });
	return res.redirect("/profile");
}

function checkNotAuthencticated(req, res, next) {
    if (!req.cookies.token) {
        return next();
    }
    else {
        return res.redirect("/profile");
    }
}


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get("/login", checkNotAuthencticated, (req, res) => {
    res.sendFile(__dirname + "/html/login.html");
});

app.post("/login", signIn);

app.get("/logout", (req, res) => {
    res.cookie('token', '', { maxAge: 0 });
    return res.redirect("/login");
});

app.get("/profile", welcome);

app.get("/refresh", refresh);

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


app.listen(3000);
