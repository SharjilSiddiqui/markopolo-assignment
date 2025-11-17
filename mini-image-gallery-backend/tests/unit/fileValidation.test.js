const { validateFile, MAX_SIZE } = require("../../utils/fileValidation");

describe("File Validation Utility", () => {

  test("should reject no file", () => {
    expect(validateFile(null)).toBe("No file uploaded");
  });

  test("should reject invalid mimetype", () => {
    const file = { mimetype: "text/plain", size: 1000 };
    expect(validateFile(file)).toBe("Only JPEG / PNG allowed.");
  });

  test("should reject file larger than 3MB", () => {
    const file = { mimetype: "image/jpeg", size: MAX_SIZE + 1 };
    expect(validateFile(file)).toBe("File size must not exceed 3MB.");
  });

  test("should accept valid jpeg", () => {
    const file = { mimetype: "image/jpeg", size: 500000 };
    expect(validateFile(file)).toBe(null);
  });

  test("should accept valid png", () => {
    const file = { mimetype: "image/png", size: 500000 };
    expect(validateFile(file)).toBe(null);
  });
});
