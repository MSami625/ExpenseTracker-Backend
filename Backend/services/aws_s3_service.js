const AWS = require("aws-sdk");

// Function to upload data to S3
exports.uploadToS3 = async (fileName, data) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `expenses/${fileName}`,
      Body: data,
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw err;
  }
};
