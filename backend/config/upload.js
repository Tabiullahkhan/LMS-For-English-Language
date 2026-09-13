const multer = require("multer");

// Store uploaded files temporarily in memory.
// They will be sent to Cloudinary instead of being saved on Render's disk.
const storage = multer.memoryStorage();

// Only allow image files, and cap size at 5MB.
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;