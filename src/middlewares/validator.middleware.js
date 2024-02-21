import { body, validationResult } from "express-validator";

const requestValidator = async (req, res, next) => {
  const rules = [
    body("csvFile").custom((value, { req }) => {
      const uploadedFile = req.file;

      if (!uploadedFile) {
        throw new Error("CSV File is required");
      }

      const isCSV = uploadedFile.filename.slice(-3) === "csv";

      if (!isCSV) {
        throw new Error(
          "Uploaded File is not a CSV File. Please Upload a CSV file"
        );
      }
      return true;
    }),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .render("index", { error: validationErrors.array()[0].msg, files: null });
  }
  next();
};

export default requestValidator;
