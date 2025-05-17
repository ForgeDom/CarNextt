const fs = require("fs");
const path = require("path");

const Dir = path.join(process.cwd(), "public", "car_music");
const files = fs.readdirSync(Dir);

// Фильтруем только изображения
const musicFiles = files.filter((file) =>
  /\.(mp3)$/i.test(file)
);

fs.writeFileSync(
  path.join(process.cwd(), "public", "music-list.json"),
  JSON.stringify(musicFiles, null, 2)
);

console.log("music-list.json writed to public/ succesfully");