const secrets = require("./secrets.js"); // Secrets for API access
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
const app = express();
const PORT = 3000;

const mailChimpPingURL =
	"https://us" + secrets.mailChimpDataCenter + ".api.mailchimp.com/3.0/ping";

const url =
	"https://us" +
	secrets.mailChimpDataCenter +
	".api.mailchimp.com/3.0/lists/" +
	secrets.mailChimpAudienceID;

const options = {
	method: "POST",
	auth: "User:" + secrets.mailChimpAPIKey,
};

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

	let jsonData = JSON.stringify(data);

	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			response.on("data", (data) => {
				/*
				Mailchimp's API has custom error code handling stored in an array (errors). 
				We are able to perform different actions once we determine the reponse's error code found in the body of the data.
				*/

				if (JSON.parse(data).errors.length === 0) {
					res.sendFile(__dirname + "/success.html");
				} else {
					// Handling for existing user error codes
					if (
						JSON.parse(data).errors[0].error_code === "ERROR_CONTACT_EXISTS"
					) {
						res.send(
							"<script>alert('User Already Exists');" +
								"window.location.replace('/');</script>"
						);
					} else {
						//Output the error code
						res.send(
							"Error subscribing: " +
								JSON.parse(data).errors[0].error +
								"|| Error Code: " +
								JSON.parse(data).errors[0].error_code
						);
						res.sendFile(__dirname + "/failure.html");
					}
				}
			});
		} else {
			res.send("HTTP Status Code: " + response.statusCode);
		}
	});

	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

app.listen(PORT, function () {
	console.log("Server is running on port: " + PORT);
});
