const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
let weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
	new Date().getDay()
];

let today = new Date();
let dateOptions = {
	weekday: "long",
	day: "numeric",
	month: "long",
};

let date = today.toLocaleDateString("en-us", dateOptions);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("list", { dayName: date });
});

app.post("/", (req, res) => {
	console.log(req);
});

app.listen(port, () => {
	console.log("Listening on port " + port + ".");
});
