const AWS = require("aws-sdk");

exports.processProductQueue = async (event) => {
  for (const record of event.Records) {
    const product = JSON.parse(record.body);

    console.log("Procesando producto:", product);
    // Aquí puedes agregar lógica para enviar emails, actualizar bases de datos, etc.
  }

  return { statusCode: 200 };
};
