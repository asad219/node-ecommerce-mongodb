import DataURIParser from "datauri/parser.js"; //parser is in the datauri module
import path from "path"; // path is default function of node js

export const getDataUri = (file) => {
  console.log(file.originalname);
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};
