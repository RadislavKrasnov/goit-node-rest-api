import multer from "multer";
import path from "node:path";

export const fileUploader = multer({
  dest: path.join(process.cwd(), "temp"),
});
