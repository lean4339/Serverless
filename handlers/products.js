const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const sqs = new AWS.SQS();
const SQS_QUEUE_URL = process.env.SQS_QUEUE;

exports.createProduct = async (event) => {
  const { name, price } = JSON.parse(event.body);
  const product = { productId: uuidv4(), name, price };

  await dynamoDb.put({ TableName: PRODUCTS_TABLE, Item: product }).promise();

  // Enviar mensaje a SQS
  await sqs.sendMessage({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(product),
  }).promise();

  return { statusCode: 201, body: JSON.stringify({ message: "Producto creado" }) };
};

exports.listProducts = async () => {
    try {  
        const result = await dynamoDb.scan({ TableName: PRODUCTS_TABLE }).promise();
        return { statusCode: 200, body: JSON.stringify(result.Items) };
    } catch (error) {
        return {statusCode: 500, body: JSON.stringify({succes: false, error})}
    }
};
