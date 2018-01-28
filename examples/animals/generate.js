const path = require("path");

const run = require("../../src/runner");

const dir 		= path.resolve(__dirname, "content");
const type 		= path.resolve(__dirname, "Animal.ts");
const output 	= path.resolve(__dirname, "output.ts");

run(output, type, dir);