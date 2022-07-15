const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const date = require(__dirname + "/date.js");

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("list", { listTitle: date.getDate(), newListItems: items });
});

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.post("/", (req, res) => {
	let item = req.body.newItem;
	let listName = req.body.list;

	if (listName === "Work") {
		workItems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}

	console.log(item + "added to list: " + listName);
});

app.post("/work", (req, res) => {
	let item = req.body.newItem;
	workItems.push(item);
	res.redirect("/work");
});

app.listen(port, () => {
	console.log("Listening on port " + port + ".");
});
