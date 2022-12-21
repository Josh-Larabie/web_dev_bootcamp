//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(express.static("public"));

mongoose.connect(
	"mongodb+srv://josh:G0Bpx6GqPfJjyM17@cluster0.lowqn1e.mongodb.net/wikiDB",
	{
		useNewUrlParser: true,
	}
);

const articleSchema = {
	title: String,
	content: String,
};

const Article = mongoose.model("Article", articleSchema);

// PRUNE UNWANTED FIELDS FROM MONGOOSE DOCUMENTS
// Article.updateMany({}, { $unset: { fieldName: 1 } }, { multi: true }, (err) => {
// 	if (!err) {
// 		console.log("Successfully updated article.");
// 	} else {
// 		console.log(err);
// 	}
// });

// Requests targeting all articles
app
	.route("/articles")
	.get(function (req, res) {
		Article.find(function (err, foundArticles) {
			if (!err) {
				res.send(foundArticles);
			} else {
				res.send(err);
			}
		});
	})
	.post(function (req, res) {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});
		newArticle.save(function (err) {
			if (!err) {
				res.send("Successfully added a new article.");
			} else {
				res.send(err);
			}
		});
	})
	.delete(function (req, res) {
		Article.deleteMany(function (err) {
			if (!err) {
				res.send("Successfully deleted all articles.");
			} else {
				res.send(err);
			}
		});
	});

// Requests targeting a specific article

app
	.route("/articles/:articleTitle")

	// Retrieve a specific article
	.get(function (req, res) {
		Article.findOne(
			{ title: req.params.articleTitle },
			function (err, foundArticle) {
				if (foundArticle) {
					res.send(foundArticle);
				} else {
					res.send("No articles matching that title was found.");
				}
			}
		);
	})

	// Update a specific article by replacing it
	.put(function (req, res) {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			{ strict: false },
			// { upsert: true }, // Option to insert if not found
			function (err) {
				if (!err) {
					res.send("Successfully updated article.");
				}
			}
		);
	})

	// Updates a specific field or fields of a specific article without replacing it
	// If the field does not exist, it will be created if passed through request and exists on the schema
	.patch(function (req, res) {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ $set: { content: req.body.content, content2: req.body.content2 } },
			function (err) {
				if (!err) {
					res.send("Successfully updated article.");
				} else {
					res.send(err);
				}
			}
		);
	})

	.delete(function (req, res) {
		Article.deleteOne({ title: req.params.articleTitle }, function (err) {
			if (!err) {
				res.send("Successfully deleted the corresponding article.");
			} else {
				res.send(err);
			}
		});
	});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
