const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = "supersecret";

exports.register = async (event) => {
  const { email, password } = JSON.parse(event.body);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    userId: uuidv4(),
    email,
    password: hashedPassword,
  };

  await dynamoDb.put({ TableName: USERS_TABLE, Item: user }).promise();

  return { statusCode: 201, body: JSON.stringify({ message: "Usuario creado" }) };
};

exports.login = async (event) => {
  const { email, password } = JSON.parse(event.body);

  const result = await dynamoDb.scan({ TableName: USERS_TABLE }).promise();
  const user = result.Items.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { statusCode: 401, body: JSON.stringify({ message: "Credenciales incorrectas" }) };
  }

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "1h" });

  return { statusCode: 200, body: JSON.stringify({ token }) };
};
