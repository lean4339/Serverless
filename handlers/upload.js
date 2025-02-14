const AWS = require("aws-sdk");

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME;

exports.uploadImage = async (event) => {
  const { fileName, fileType } = JSON.parse(event.body);
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploads/${fileName}`,
    ContentType: fileType,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);

  return { statusCode: 200, body: JSON.stringify({ uploadURL }) };
};
