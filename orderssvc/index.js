require("dotenv").config();
const credentials = require("../credentials.js");

const express = require("express");
const bodyParser = require("body-parser");

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to NodeShop Orders.");
});

console.log(`Orders service listening on port ${port}`);

app.listen(port);

// Import the AWS SDK
const AWS = require("aws-sdk");

// Create an SQS service object
const sqs = new AWS.SQS({
  apiVersion: "2012-11-05"
});
const queueUrl = credentials.queueUrl;

// the new endpoint
app.post("/order", (req, res) => {
  let orderData = {
    userEmail: req.body["userEmail"],
    itemName: req.body["itemName"],
    itemPrice: req.body["itemPrice"],
    itemsQuantity: req.body["itemsQuantity"]
  };

  let sqsOrderData = {
    MessageAttributes: {
      userEmail: {
        DataType: "String",
        StringValue: orderData.userEmail
      },
      itemName: {
        DataType: "String",
        StringValue: orderData.itemName
      },
      itemPrice: {
        DataType: "Number",
        StringValue: orderData.itemPrice
      },
      itemsQuantity: {
        DataType: "Number",
        StringValue: orderData.itemsQuantity
      }
    },
    MessageBody: JSON.stringify(orderData),
    MessageDeduplicationId: req.body["userEmail"],
    MessageGroupId: "UserOrders",
    QueueUrl: queueUrl
  };

  // Send the order data to the SQS queue
  let sendSqsMessage = sqs.sendMessage(sqsOrderData).promise();

  sendSqsMessage
    .then(data => {
      console.log(`OrdersSvc | SUCCESS: ${data.MessageId}`);
      res.send(
        "Thank you for your order. Check you inbox for the confirmation email."
      );
    })
    .catch(err => {
      console.log(`OrdersSvc | ERROR: ${err}`);
      // Send email to emails API
      res.send("We ran into an error. Please try again.");
    });
});
