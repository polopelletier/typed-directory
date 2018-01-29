const path = require("path");

const compiler = require("../../src/compiler");

const configFile = path.resolve(__dirname, "typed-directory.config.json");

compiler(configFile);