const path = require("path");

const compiler = require("../../src/runner");

const configFile = path.resolve(__dirname, "typed-directory.config.json");

compiler(configFile);