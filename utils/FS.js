const fs = require("fs");

const mkdir = function (dir) {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
};

const writeFile = function (dir, files, data) {
  fs.writeFile(`${dir} ${files}`, data, (error) => {
    if (error) throw error;
    console.log(`${files} written !`);
  });
};

exports.mkdir = mkdir;
exports.writeFile = writeFile;
