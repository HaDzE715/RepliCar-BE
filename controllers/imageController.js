const { uploadToStorage } = require("../services/googleCloudStorage");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the image to Google Cloud Storage
    const publicUrl = await uploadToStorage(req.file);

    res.status(201).json({
      message: "Image uploaded successfully",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image", error: error.message });
  }
};
