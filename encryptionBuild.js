const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const directoryPath = path.join(__dirname, "build/static/js");
const files = fs
  .readdirSync(directoryPath)
  .filter((file) => file.includes("main"));

if (files.length > 0) {
  const mainFile = files[0];
  const obfuscatorCommand = `javascript-obfuscator ${path.join(
    directoryPath,
    mainFile
  )} --output ${path.join(directoryPath, mainFile)}`;
  execSync(obfuscatorCommand, { stdio: "inherit" });
} else {
  process.exit(1);
}
