require("dotenv").config();
const credentials = require("../credentials.js");

const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");

const { Consumer } = require("sqs-consumer");

const queueUrl = credentials.queueUrl;

let transport = nodemailer.createTransport(credentials.transport);

function sendMail(message) {
  let sqsMessage = JSON.parse(message.Body);
  const emailMessage = {
    from: credentials.emailMessage.from, // Sender address
    to: sqsMessage.userEmail, // Recipient address
    subject: "Order Received | NodeShop", // Subject line
    html: `<p>Hi ${sqsMessage.userEmail}.</p. <p>Your order of ${sqsMessage.itemsQuantity} ${sqsMessage.itemName} has been received and is being processed.</p> <p> Thank you for shopping with us! </p>` // Plain text body
  };
  transport.sendMail(emailMessage, (err, info) => {
    if (err) {
      console.log(`EmailsSvc | ERROR: ${err}`);
    } else {
      console.log(`EmailsSvc | INFO: ${info}`);
    }
  });
}

// Create our consumer
const app = Consumer.create({
  queueUrl: queueUrl,
  handleMessage: async message => {
    sendMail(message);
  },
  sqs: new AWS.SQS()
});

app.on("error", err => {
  console.error(err.message);
});

app.on("processing_error", err => {
  console.error(err.message);
});

console.log("Emails service is running");

app.start();
