const fse = require("fs-extra");

const srcDir = `./src/i18n`;
const destDir = `./build/i18n/`;

// To copy a folder or file

try {
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });
} catch (error) {
  console.error(error);
}
