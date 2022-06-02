const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();
const PORT = 3000;
const mailChimpAPIKey = "4a4f5ee9977851391aaaa727c36b5647-us14";
const mailChimpDataCenter = "14";
const mailChimpAudienceID = "99c9a94bac";
const mailChimpPingURL =
	"https://us" + mailChimpDataCenter + ".api.mailchimp.com/3.0/ping";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
	const firstName = req.body.fName;
	const lastName = req.body.lName;
	const emailAddress = req.body.emailAddress;

	const data = {
		members: [
			{
				email_address: emailAddress,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	var jsonData = JSON.stringify(data);
	console.log(jsonData);

	const url =
		"https://us" +
		mailChimpDataCenter +
		".api.mailchimp.com/3.0/lists/" +
		mailChimpAudienceID;

	const options = {
		method: "POST",
		auth: "User:" + mailChimpAPIKey,
	};

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			response.on("data", (data) => {
				console.log(JSON.parse(data));

				/*
				Mailchimp's API has custom error code handling stored in an array (errors). 
				We are able to perform different actions once we determine the reponse's error code found in the body of the data.
				(data.errors) is an array, therefore we must ensure contents exist before accessing a specific index.
				*/

				if (JSON.parse(data).errors.length === 0) {
					res.sendFile(__dirname + "/success.html");
				} else {
					// Special handling for existing user error codes
					if (
						JSON.parse(data).errors[0].error_code === "ERROR_CONTACT_EXISTS"
					) {
						res.send(
							"<script>alert('User Already Exists');" +
								"window.location.replace('/');</script>"
						);
					} else {
						// Output the error code
						// res.send(
						// 	"Error subscribing: " +
						// 		JSON.parse(data).errors[0].error +
						// 		"|| Error Code: " +
						// 		JSON.parse(data).errors[0].error_code
						// );
						res.sendFile(__dirname + "/failure.html");
					}
				}
			});
		} else {
			// Outputs Response Data to Console
			// response.on("data", function (data) {
			// console.log(JSON.parse(data));

			res.send("HTTP Status Code: " + response.statusCode);
		}
	});

	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

// Deploy app locally
// app.listen(PORT, function () {
// 	console.log("Server is running on port: " + PORT);
// });

// Deploy app to Heroku (process.env.PORT) or Locally
app.listen(process.env.PORT || PORT, function () {
	console.log("Server is running on port: " + PORT);
});
