const fs = require("fs");
const path = require("path");

const photosDir = path.join(process.cwd(), "public", "photos");
const files = fs.readdirSync(photosDir);

// Фильтруем только изображения
const imageFiles = files.filter((file) =>
  /\.(jpg|jpeg|png|gif)$/i.test(file)
);

fs.writeFileSync(
  path.join(process.cwd(), "public", "photos-list.json"),
  JSON.stringify(imageFiles, null, 2)
);

console.log("photos-list.json writed to the public/ succesfully");