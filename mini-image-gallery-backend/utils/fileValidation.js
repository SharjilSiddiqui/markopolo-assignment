const MAX_SIZE = 3 * 1024 * 1024; 
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

function validateFile(file) {
  if (!file) return "No file uploaded";
  if (!ALLOWED_TYPES.includes(file.mimetype)) return "Only JPEG / PNG allowed.";
  if (file.size > MAX_SIZE) return "File size must not exceed 3MB.";
  return null;
}

module.exports = { validateFile, MAX_SIZE, ALLOWED_TYPES };
