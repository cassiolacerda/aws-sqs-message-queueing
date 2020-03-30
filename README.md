# Purpose

Sending email confirmations asynchronously through the messaging queue will allow the orders service to continue receiving orders despite the load since it does not have to worry about sending the emails.

Also, in case the mail service goes down, once brought back up, it will continue dispatching emails from the queue, therefore, we won't have to worry about lost orders.

- [Tutorial](https://stackabuse.com/message-queueing-in-node-js-with-aws-sqs/)

```

## Learned packages

aws-sdk
body-parser
dotenv
express
nodemailer
npm-run-all
sqs-consumer

```
