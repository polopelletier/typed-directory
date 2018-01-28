const path = require("path");

const run = require("../../src/runner");

const configFile = path.resolve(__dirname, "typed-directory.config.json");

run(configFile);