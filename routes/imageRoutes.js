const express = require("express");
const upload = require("../middlewares/multer");
const { uploadImage } = require("../controllers/imageController");

const router = express.Router();

// POST /api/images/upload
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
