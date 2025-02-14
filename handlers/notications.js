const AWS = require("aws-sdk");

const sns = new AWS.SNS();
const SNS_TOPIC_ARN = process.env.SNS_TOPIC;

exports.sendNotification = async (event) => {
  const { subject, message } = JSON.parse(event.body);

  const params = {
    TopicArn: SNS_TOPIC_ARN,
    Subject: subject,
    Message: message,
  };

  await sns.publish(params).promise();

  return { statusCode: 200, body: JSON.stringify({ message: "Notificación enviada" }) };
};
