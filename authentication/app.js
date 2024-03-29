//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const e = require("express");
//const secret = process.env.SECRET_KEY;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(
	session({
		secret: "Our little secret.",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 weekk long session
	})
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
	"mongodb+srv://Josh:dyJQaH90lyA7P2G6@cluster0.ezss5il.mongodb.net/userDB",
	{ useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
	secretMessage: String,
	// firstName: String,
	// lastName: String,
	// picture: String,
});

userSchema.plugin(passportLocalMongoose);

// Ensure to add the secret key before the model is initialized
//userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/secrets",
			userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile);
			User.findOne({ googleId: profile.id }, function (err, foundUser) {
				if (!err) {
					//Check for any errors
					if (foundUser) {
						// Check for if we found any users
						return cb(null, foundUser); //Will return the foundUser
					} else {
						//Create a new User
						const newUser = new User({
							googleId: profile.id,
							// firstName: profile.name.givenName,
							// lastName: profile.name.familyName,
							// picture: profile.photos[0].value,
						});
						newUser.save(function (err) {
							if (!err) {
								return cb(null, newUser); //return newUser
							}
						});
					}
				} else {
					console.log(err);
				}
			});
		}
	)
);

app.get("/", function (req, res) {
	if (req.isAuthenticated()) {
		User.find({ secretMessage: { $ne: null } }, function (err, foundUsers) {
			if (err) {
				console.log(err);
			} else {
				if (foundUsers) {
					res.render("secrets", { usersWithSecrets: foundUsers });
				}
			}
		});
	} else {
		res.render("home");
	}
});

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile"] })
);

app.get(
	"/auth/google/secrets",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect secrets.
		res.redirect("/secrets");
	}
);

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/register", function (req, res) {
	res.render("register");
});

app.get("/secrets", function (req, res) {
	User.find({ secretMessage: { $ne: null } }, function (err, foundUsers) {
		if (err) {
			console.log(err);
		} else {
			if (foundUsers) {
				res.render("secrets", { usersWithSecrets: foundUsers });
			}
		}
	});
});

// Private secrets page for logged in users
// app.get("/secrets", function (req, res) {
// if (req.isAuthenticated()) {
// 	User.find({ secretMessage: { $ne: null } }, function (err, foundUsers) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			if (foundUsers) {
// 				res.render("secrets", { usersWithSecrets: foundUsers });
// 			}
// 		}
// 	});
// } else {
// 	res.redirect("/login");
// }

// Public secrets page for all users
// });

app.get("/submit", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("submit");
	} else {
		res.redirect("/login");
	}
});

app.post("/submit", function (req, res) {
	const submittedSecret = req.body.secretMessage;

	//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
	// console.log(req.user.id);

	User.findById(req.user.id, function (err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				foundUser.secretMessage = submittedSecret;
				foundUser.save(function () {
					res.redirect("/secrets");
				});
			}
		}
	});
});

app.get("/logout", function (req, res) {
	req.session.destroy(function (err) {
		res.redirect("/"); //Inside a callback… bulletproof!
	});
});

app.post("/register", function (req, res) {
	User.register(
		{ username: req.body.username },
		req.body.password,
		function (err, user) {
			if (err) {
				console.log(err);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req, res, function () {
					res.redirect("/secrets");
				});
			}
		}
	);
});

app.post("/login", function (req, res) {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});

	req.login(user, function (err) {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/secrets");
			});
		}
	});
});

app.listen(3000, function () {
	console.log("Server started on port 3000.");
});
