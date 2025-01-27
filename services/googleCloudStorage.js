const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, "../replicar-8c1b32476ea7.json"), // Replace with your actual path
});

const bucketName = "poster-buckets";
const bucket = storage.bucket(bucketName);

// Define the uploadToStorage function
const uploadToStorage = async (file) => {
  const blob = bucket.file(file.originalname); // Name the file as its original name
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype, // Set the correct content type
    },
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on("error", (err) => reject(err))
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      })
      .end(file.buffer);
  });
};

// Export the function
module.exports = { uploadToStorage };
