const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
let items = ["Buy Food", "Cook Food", "Eat Food"];

let weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
	new Date().getDay()
];

let today = new Date();
let dateOptions = {
	weekday: "long",
	day: "numeric",
	month: "long",
};

let day = today.toLocaleDateString("en-us", dateOptions);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("list", { dayName: day, newListItems: items });
});

app.post("/", (req, res) => {
	let item = req.body.newItem;
	items.push(item);

	console.log(item);
	res.redirect("/");
});

app.listen(port, () => {
	console.log("Listening on port " + port + ".");
});
